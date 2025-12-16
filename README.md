this is an ai pdf chrome extension developed by harrison yeboah of denison university 

## my proj structure

```
PdfReader/
├── manifest.json                 # chrome permissions
├── client/                       
│   ├── popup.html              
│   ├── popup.js                  
│   ├── styles.css                
│   ├── background.js             
│   ├── content.js                
│   ├── slider.js                 
│   └── main.js                   
└── server/                       # backend spring boot
    ├── pom.xml                   
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/pdfreader/server/
    │   │   │       ├── PdfReaderServerApplication.java  # mainapplication
    │   │   │       └── controller/
    │   │   │           └── PdfController.java           # controller
    │   │   └── resources/
    │   │       └── application.properties               # application configuration
    │   └── test/
    │       └── java/
    │           └── com/pdfreader/server/                
    └── target/                   
```

## features

### front end chrome ui black 
* my front end is black themed with a pdf detection detection feature.

### spring boot server (backend)
* this basically takes in a pdf link we then split the pdf and send it throgh our second controller called get audio batch. 

## Setup Instructions

### Prerequisites
- java 17 or higher
- maven 3.6+ (or use Maven Wrapper)
- node.js (for development)
- chrome browser
- openAI API key (for text-to-speech)
- pdf.co API key (for PDF splitting)

### set up the spring boot server (Spring Boot Server)

1. **navigate to server directory**:
   ```bash
   cd server
   ```

2. **create the `.env` file** in the server directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   API_KEY=your_pdf_co_api_key_here
   ```

3. **start the build**:
   ```bash
   mvn clean install
   ```

4. **run with maven**:
   ```bash
   mvn spring-boot:run
   ```

   or if you have the JAR file:
   ```bash
   java -jar target/pdfreader-server-1.0.0.jar
   ```

my backend link is `http://localhost:8080`

### Frontend Setup (Chrome Extension)

1. **open chrome extensions link**:
   - head to `chrome://extensions/`
   - go to developer mode

2. **load the extension**:
   - Click "Load unpacked"
   - Select the `PdfReader` folder (containing `manifest.json`)



## my endpoints

- `GET /api/pdf/health` - this checks the health
- `POST /api/pdf/splitPDF` - this splits the pdf into individual pages
  - this will return an array of page URLs
- `POST /api/pdf/getAudioBatch` - then we send one more request to fetch through openai.
  - request body: `{"pdfUrls": ["url1", "url2", ...]}`

### my curls
```bash
# Health check
curl http://localhost:8080/api/pdf/health

# Split PDF
curl -X POST http://localhost:8080/api/pdf/splitPDF \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/document.pdf"}'

# Get audio batch
curl -X POST http://localhost:8080/api/pdf/getAudioBatch \
  -H "Content-Type: application/json" \
  -d '{"pdfUrls": ["https://example.com/page1.pdf", "https://example.com/page2.pdf"]}'
```

## development


### building the Project
```bash
cd server
mvn clean package
```


### env file
start an `.env` file in the `server/` directory with:
```
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_pdf_co_api_key
```

### chrome extenison manifest
key settings in `manifest.json`:
- `permissions` - extension permissions
- `host_permissions` - allow host permissions
- `action.default_popup` - popup HTML file


