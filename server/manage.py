# PDF Reader Server - Django Management Script

import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pdf_reader_server.settings')
    django.setup()
    execute_from_command_line(sys.argv)
