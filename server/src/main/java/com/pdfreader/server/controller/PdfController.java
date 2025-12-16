// src/main/java/com/pdfreader/server/controller/PdfController.java
package com.pdfreader.server.controller;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.HashMap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.*;

import java.time.Duration;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;   // ✅ ADD THIS

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PdfController {


   private static final Dotenv dotenv = Dotenv.load();
   private static final String OPENAI_API_KEY = dotenv.get("OPENAI_API_KEY");
   private static final String API_KEY = dotenv.get("API_KEY");
   private final String AUDIO_OUTPUT_DIR = "audio/";


   public String extractTextFromPdf(String pdfUrl) {
       try (InputStream in = new URL(pdfUrl).openStream();
            PDDocument document = PDDocument.load(in)) {


           PDFTextStripper stripper = new PDFTextStripper();
           stripper.setSortByPosition(true);
           stripper.setLineSeparator("\n");
           stripper.setWordSeparator(" ");


           String text = stripper.getText(document);
           return cleanTextForSpeech(text);


      } catch (Exception e) {
           System.err.println("❌ PDF extraction failed for: " + pdfUrl);
           e.printStackTrace();
           return null;
       }
   }


   private String cleanTextForSpeech(String text) {
       if (text == null || text.trim().isEmpty()) return null;
       System.out.println(text);
       return text
               .replaceAll("\\n{3,}", "\n\n")
               .replaceAll("[ \\t]{2,}", " ")
               .replaceAll("([a-z])([A-Z])", "$1 $2")
               .replaceAll("(\\d+)\\.(\\d+)", "$1 point $2")
               .replaceAll("(?m)^Page \\d+.*$", "")
               .replaceAll("(?m)^\\d+\\s*$", "")
               .replaceAll("-\\s*\\n\\s*", "")
               .replaceAll("^[•◦▪▫–—]\\s*", "")
               .replaceAll("\\s+([.,;:!?])", "$1")
               .replaceAll("([.,;:!?])([A-Za-z])", "$1 $2")
               .trim();
   }





public List<String> convertTextToSpeech(String text) {
    List<String> audioFiles = new ArrayList<>();
    OkHttpClient client = new OkHttpClient();
    int maxChunkSize = 2000;

    File dir = new File(AUDIO_OUTPUT_DIR);
    if (!dir.exists()) dir.mkdirs();

    // Delete all previous files in AUDIO_OUTPUT_DIR
    File[] existingFiles = dir.listFiles();
    if (existingFiles != null) {
        for (File file : existingFiles) {
            if (file.isFile() && file.getName().endsWith(".mp3")) {
                file.delete();
            }
        }
    }

    ObjectMapper mapper = new ObjectMapper();

    for (int i = 0; i < text.length(); i += maxChunkSize) {
        String chunk = text.substring(i, Math.min(text.length(), i + maxChunkSize));
        String uniqueFileName = "audio-" + UUID.randomUUID() + ".mp3";
        String outputFilePath = AUDIO_OUTPUT_DIR + uniqueFileName;

        try {
            ObjectNode root = mapper.createObjectNode();
            root.put("model", "tts-1");
            root.put("voice", "alloy");
            root.put("input", chunk);
            root.put("response_format", "mp3");

            String jsonBody = mapper.writeValueAsString(root);

            okhttp3.RequestBody body = okhttp3.RequestBody.create(
                    jsonBody,
                    okhttp3.MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/audio/speech")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + OPENAI_API_KEY)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.out.println("❌ TTS request failed: " + response);
                    continue;
                }

                byte[] audioBytes = response.body().bytes();
                try (FileOutputStream fos = new FileOutputStream(outputFilePath)) {
                    fos.write(audioBytes);
                }

                // Full URL for client access
                String fileUrl = "http://localhost:8080/audio/" + uniqueFileName;
                audioFiles.add(fileUrl);
                System.out.println("✅ Created audio file: " + fileUrl);

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    return audioFiles;
}


   @GetMapping("/health")
   public String health() {
        System.out.println("Health check endpoint called");
        return "PDF Reader Server is running!";
   }


@PostMapping("/splitPDF")
public ResponseEntity<?> fetchPdf(@RequestBody Map<String, String> request) {
    String pdfUrl = request.get("pdfUrl");

    if (pdfUrl == null || pdfUrl.isEmpty()) {
        return ResponseEntity.badRequest().body("No PDF URL provided");
    }

    System.out.println("📄 Received PDF URL: " + pdfUrl);

    try {
        String requestBody = "{ \"url\": \"" + pdfUrl + "\" }";

        WebClient client = WebClient.builder()
                .baseUrl("https://api.pdf.co/v1/pdf/split")
                .defaultHeader("x-api-key", API_KEY)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String response = client.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(60))
                .block(Duration.ofSeconds(65));

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);
        JsonNode urls = root.path("urls");

        if (!urls.isArray()) {
            return ResponseEntity.status(500).body("Failed to split PDF");
        }

        List<String> pageUrls = new ArrayList<>();
        for (JsonNode urlNode : urls) {
            pageUrls.add(urlNode.asText());
        }

        return ResponseEntity.ok(pageUrls);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error splitting PDF: " + e.getMessage());
    }
}



    @PostMapping("/getAudioBatch")
    public ResponseEntity<?> getAudioBatch(@RequestBody Map<String, List<String>> request) {
        List<String> pdfUrls = request.get("pdfUrls");

        if (pdfUrls == null || pdfUrls.isEmpty()) {
            return ResponseEntity.badRequest().body("No PDF URLs provided");
        }

        List<Map<String, Object>> pages = new CopyOnWriteArrayList<>();
        ExecutorService executor = Executors.newFixedThreadPool(Math.min(5, pdfUrls.size()));

        try {
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            for (int i = 0; i < pdfUrls.size(); i++) {
                final int pageIndex = i;
                final String pdfUrl = pdfUrls.get(i);

                CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                    try {
                        String text = extractTextFromPdf(pdfUrl);
                        if (text == null || text.isEmpty()) {
                            System.err.println("⚠️ Skipping empty page: " + pdfUrl);
                            return;
                        }

                        List<String> audioFiles = convertTextToSpeech(text);

                        Map<String, Object> page = new HashMap<>();
                        page.put("pageNumber", pageIndex + 1);
                        page.put("audioFiles", audioFiles);

                        pages.add(page);
                        System.out.println("✅ Added page " + (pageIndex + 1));

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }, executor);

                futures.add(future);
            }

            // Wait for all pages to finish
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            // Sort pages by pageNumber to ensure correct order
            pages.sort((a, b) -> {
                Integer pageA = (Integer) a.get("pageNumber");
                Integer pageB = (Integer) b.get("pageNumber");
                return pageA.compareTo(pageB);
            });

        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        // Return JSON in the structure your frontend expects
        return ResponseEntity.ok(Map.of("pages", pages));
    }



   @GetMapping("/splitPDF")
   public String fetchPdfGetMessage() {
       return "Use POST to send a PDF URL to /api/pdf/splitPDF";
   }
}