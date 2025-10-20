# Noto PDF Reader Chrome Extension & Django Server

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
│   ├── content.js                # Content script for web pages
│   └── slider.js                 # Slider functionality
└── server/                       # Django backend server
    ├── manage.py                 # Django management script
    ├── requirements.txt          # Python dependencies
    └── noto_server/              # Django project settings
        ├── __init__.py
        ├── settings.py           # Django settings
        ├── urls.py               # Main URL configuration
        ├── wsgi.py               # WSGI configuration
        └── asgi.py               # ASGI configuration
    └── api/                      # Django API app
        ├── __init__.py
        ├── apps.py               # App configuration
        ├── models.py             # Database models
        ├── views.py              # API views
        ├── urls.py               # App URL configuration
        ├── admin.py              # Admin interface
        └── tests.py              # Test cases
```

## Features

### Chrome Extension (Client)
- **Modern UI**: Beautiful, dark-themed interface with Noto branding
- **Voice Selection**: Multiple voice options (Noto, Leda, Kore, Zephyr)
- **Playback Controls**: Play/pause functionality with visual feedback
- **Page Navigation**: Current page display with input controls
- **Speed Control**: Adjustable reading speed slider
- **Content Detection**: Automatically detects PDF content on web pages

### Django Server (Backend)
- **Simple API**: Basic Hello World endpoint for testing
- **Health Check**: Server health monitoring endpoint
- **CORS Support**: Configured for Chrome extension communication
- **REST Framework**: Ready for API development

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
   - Test the voice selection and playback controls

## API Endpoints

### Basic Endpoints
- `GET /api/hello/` - Returns Hello World message
- `POST /api/hello/` - Returns Hello World with received data
- `GET /api/health/` - Health check endpoint

### Example Usage
```bash
# Test Hello World endpoint
curl http://localhost:8000/api/hello/

# Test with POST data
curl -X POST http://localhost:8000/api/hello/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Health check
curl http://localhost:8000/api/health/
```

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
Key settings in `server/noto_server/settings.py`:
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
2. **API Connection Fails**: Check that the Django server is running on port 8000
3. **Extension Not Loading**: Verify `manifest.json` syntax and file paths
4. **Hello World Not Working**: Test the API endpoints with curl first

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
