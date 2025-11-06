# PDF Reader Chrome Extension & Spring Boot Server

A Chrome extension for reading PDFs with a Java Spring Boot backend server that extracts text from PDFs and converts it to audio using OpenAI's text-to-speech API.

## Project Structure

```
PdfReader/
├── manifest.json                 # Chrome extension manifest
├── client/                       # Chrome extension frontend
│   ├── popup.html               # Extension popup interface
│   ├── popup.js                  # Popup functionality
│   ├── styles.css                # Extension styling
│   ├── background.js             # Background script
│   ├── content.js                # Content script for web pages
│   ├── slider.js                 # Slider functionality
│   └── main.js                   # Main extension logic
└── server/                       # Spring Boot backend server
    ├── pom.xml                   # Maven dependencies and configuration
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/pdfreader/server/
    │   │   │       ├── PdfReaderServerApplication.java  # Main Spring Boot application
    │   │   │       └── controller/
    │   │   │           └── PdfController.java           # REST API controller
    │   │   └── resources/
    │   │       └── application.properties               # Application configuration
    │   └── test/
    │       └── java/
    │           └── com/pdfreader/server/                # Test classes
    └── target/                   # Maven build output (generated)
```

## Features

### Chrome Extension (Client)
- **Modern UI**: Beautiful, dark-themed interface with Noto branding
- **Voice Selection**: Multiple voice options (Noto, Leda, Kore, Zephyr)
- **Playback Controls**: Play/pause functionality with visual feedback
- **Page Navigation**: Current page display with input controls
- **Speed Control**: Adjustable reading speed slider
- **Content Detection**: Automatically detects PDF content on web pages

### Spring Boot Server (Backend)
- **PDF Text Extraction**: Extracts text from PDFs using Apache PDFBox
- **Text-to-Speech**: Converts extracted text to audio using OpenAI TTS API
- **PDF Splitting**: Splits multi-page PDFs into individual pages using PDF.co API
- **Batch Processing**: Processes multiple PDF pages concurrently
- **RESTful API**: Clean REST endpoints for PDF processing
- **CORS Support**: Configured for Chrome extension communication

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+ (or use Maven Wrapper)
- Node.js (for development)
- Chrome browser
- OpenAI API key (for text-to-speech)
- PDF.co API key (for PDF splitting)

### Backend Setup (Spring Boot Server)

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create `.env` file** in the server directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   API_KEY=your_pdf_co_api_key_here
   ```

3. **Build the project**:
   ```bash
   mvn clean install
   ```

4. **Run the Spring Boot application**:
   ```bash
   mvn spring-boot:run
   ```

   Or if you have the JAR file:
   ```bash
   java -jar target/pdfreader-server-1.0.0.jar
   ```

The Spring Boot server will be available at `http://localhost:8080`

### Frontend Setup (Chrome Extension)

1. **Open Chrome Extensions page**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

2. **Load the extension**:
   - Click "Load unpacked"
   - Select the `PdfReader` folder (containing `manifest.json`)

3. **Test the extension**:
   - Click the extension icon in the toolbar
   - Test the voice selection and playback controls

## API Endpoints

### PDF Processing Endpoints
- `GET /api/pdf/health` - Health check endpoint
- `POST /api/pdf/splitPDF` - Splits a PDF into individual pages
  - Request body: `{"pdfUrl": "https://example.com/document.pdf"}`
  - Returns: Array of page URLs
- `POST /api/pdf/getAudioBatch` - Converts multiple PDF pages to audio
  - Request body: `{"pdfUrls": ["url1", "url2", ...]}`
  - Returns: Object with pages array containing pageNumber and audioFiles

### Example Usage
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

## Development

### Running Tests
```bash
cd server
mvn test
```

### Building the Project
```bash
cd server
mvn clean package
```

### Chrome Extension Development
- Modify files in the `client/` directory
- Reload the extension in Chrome after making changes
- Check the browser console for debugging information

## Configuration

### Spring Boot Settings
Key settings in `server/src/main/resources/application.properties`:
- `server.port=8080` - Server port (default: 8080)
- `spring.application.name=pdf-reader-server` - Application name

### Environment Variables
Create a `.env` file in the `server/` directory with:
```
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_pdf_co_api_key
```

### Chrome Extension
Key settings in `manifest.json`:
- `permissions` - Extension permissions
- `host_permissions` - Allowed host permissions
- `action.default_popup` - Popup HTML file

## Dependencies

### Backend (Maven)
- Spring Boot 3.3.5
- Spring Boot Web + WebFlux (for REST and reactive WebClient)
- Apache PDFBox 2.0.30 (PDF processing)
- OkHttp 4.12.0 (HTTP client for OpenAI API)
- Jackson (JSON processing)
- Java Dotenv 5.2.2 (Environment variable management)
- Lombok (Optional, for reducing boilerplate)

## Security Notes

- Never commit `.env` file to version control
- Keep API keys secure and use environment variables
- Configure proper CORS settings for production
- Use HTTPS in production environments
- Validate and sanitize all user inputs

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Spring Boot CORS settings allow Chrome extension origins
2. **API Connection Fails**: Check that the Spring Boot server is running on port 8080
3. **Extension Not Loading**: Verify `manifest.json` syntax and file paths
4. **Missing API Keys**: Ensure `.env` file exists with valid API keys
5. **PDF Processing Fails**: Check PDF URL accessibility and PDF.co API key validity
6. **Audio Generation Fails**: Verify OpenAI API key and account credits

### Debug Mode
- Enable Chrome DevTools for extension debugging
- Check Spring Boot console logs for backend errors
- Use browser network tab to monitor API calls
- Check Maven logs for build issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

