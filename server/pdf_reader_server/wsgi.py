"""
WSGI config for pdf_reader_server project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pdf_reader_server.settings')

application = get_wsgi_application()
