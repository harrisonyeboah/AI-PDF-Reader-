"""
Tests for PDF Reader app.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import PDFDocument, PDFAnnotation

class PDFDocumentModelTest(TestCase):
    """Test cases for PDFDocument model."""
    
    def test_pdf_document_creation(self):
        """Test creating a PDF document."""
        pdf_doc = PDFDocument.objects.create(
            title="Test PDF",
            filename="test.pdf",
            file_size=1024,
            page_count=5
        )
        self.assertEqual(pdf_doc.title, "Test PDF")
        self.assertEqual(pdf_doc.filename, "test.pdf")
        self.assertEqual(pdf_doc.file_size, 1024)
        self.assertEqual(pdf_doc.page_count, 5)

class PDFReaderAPITest(APITestCase):
    """Test cases for PDF Reader API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.pdf_doc = PDFDocument.objects.create(
            title="Test PDF",
            filename="test.pdf",
            file_size=1024,
            page_count=5
        )
    
    def test_pdf_list_endpoint(self):
        """Test PDF list endpoint."""
        url = reverse('pdf-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_pdf_detail_endpoint(self):
        """Test PDF detail endpoint."""
        url = reverse('pdf-detail', kwargs={'pk': self.pdf_doc.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test PDF")
    
    def test_pdf_upload_endpoint(self):
        """Test PDF upload endpoint."""
        url = reverse('pdf-upload')
        data = {
            'pdf_data': 'dGVzdCBkYXRh',  # base64 encoded "test data"
            'filename': 'test.pdf'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
