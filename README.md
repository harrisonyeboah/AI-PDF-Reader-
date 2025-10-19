# PDF Reader Chrome Extension & Django Server

A Chrome extension for reading PDFs with a Django backend server.

## Project Structure

```
PdfReader/
├── manifest.json                 # Chrome extension manifest
├── client/                       # Chrome extension frontend
│   ├── popup.html               # Extension popup interface
│   ├── popup.js                  # Popup functionality
│   ├── styles.css                # Extension styling
│   ├── background.js             # Background script
│   └── content.js                # Content script for web pages
└── server/                       # Django backend server
    ├── manage.py                 # Django management script
    ├── requirements.txt          # Python dependencies
    ├── pdf_reader_server/        # Django project settings
    │   ├── __init__.py
    │   ├── settings.py           # Django settings
    │   ├── urls.py               # Main URL configuration
    │   ├── wsgi.py               # WSGI configuration
    │   └── asgi.py               # ASGI configuration
    └── pdf_reader/               # Django app
        ├── __init__.py
        ├── apps.py               # App configuration
        ├── models.py             # Database models
        ├── views.py              # API views
        ├── urls.py               # App URL configuration
        ├── serializers.py        # API serializers
        ├── admin.py              # Admin interface
        └── tests.py              # Test cases
```

## Features

### Chrome Extension (Client)
- **PDF Upload**: Upload and view PDF files directly in the browser
- **PDF Viewer**: Built-in PDF viewer with page navigation
- **Content Detection**: Automatically detects PDF content on web pages
- **Modern UI**: Beautiful, responsive interface with gradient design
- **PDF.js Integration**: Uses PDF.js for client-side PDF rendering

### Django Server (Backend)
- **REST API**: RESTful API endpoints for PDF management
- **PDF Processing**: Server-side PDF processing and metadata extraction
- **Annotation System**: Store and manage PDF annotations
- **CORS Support**: Configured for Chrome extension communication
- **Admin Interface**: Django admin for managing PDFs and annotations

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js (for development)
- Chrome browser

### Backend Setup (Django Server)

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create virtual environment**:
   ```bash
   brew install python@3.12
   python3.12 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**:
   ```bash
   python manage.py runserver
   ```

The Django server will be available at `http://localhost:8000`

### Frontend Setup (Chrome Extension)

1. **Open Chrome Extensions page**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

2. **Load the extension**:
   - Click "Load unpacked"
   - Select the `PdfReader` folder (containing `manifest.json`)

3. **Test the extension**:
   - Click the extension icon in the toolbar
   - Upload a PDF file to test functionality

## API Endpoints

### PDF Management
- `GET /api/pdf/` - List all PDF documents
- `POST /api/pdf/` - Create new PDF document
- `GET /api/pdf/{id}/` - Get PDF document details
- `PUT /api/pdf/{id}/` - Update PDF document
- `DELETE /api/pdf/{id}/` - Delete PDF document
- `POST /api/pdf/upload/` - Upload PDF from Chrome extension
- `GET /api/pdf/{id}/info/` - Get PDF information

### Annotations
- `GET /api/pdf/{id}/annotations/` - List PDF annotations
- `POST /api/pdf/{id}/annotations/` - Create new annotation
- `POST /api/pdf/{id}/annotations/add/` - Add annotation to PDF

## Development

### Running Tests
```bash
cd server
python manage.py test
```

### Admin Interface
Access the Django admin at `http://localhost:8000/admin/` after creating a superuser.

### Chrome Extension Development
- Modify files in the `client/` directory
- Reload the extension in Chrome after making changes
- Check the browser console for debugging information

## Configuration

### Django Settings
Key settings in `server/pdf_reader_server/settings.py`:
- `DEBUG = True` - Enable debug mode for development
- `ALLOWED_HOSTS` - Configure allowed hosts
- `CORS_ALLOW_ALL_ORIGINS = True` - Allow all origins (development only)

### Chrome Extension
Key settings in `manifest.json`:
- `permissions` - Extension permissions
- `host_permissions` - Allowed host permissions
- `action.default_popup` - Popup HTML file

## Security Notes

- Change the `SECRET_KEY` in Django settings for production
- Set `DEBUG = False` for production
- Configure proper CORS settings for production
- Use HTTPS in production environments

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Django CORS settings allow Chrome extension origins
2. **PDF Upload Fails**: Check that the Django server is running on port 8000
3. **Extension Not Loading**: Verify `manifest.json` syntax and file paths
4. **PDF Rendering Issues**: Ensure PDF.js is properly loaded

### Debug Mode
- Enable Chrome DevTools for extension debugging
- Check Django server logs for backend errors
- Use browser network tab to monitor API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
