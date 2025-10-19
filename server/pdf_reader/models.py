"""
Models for PDF Reader app.
"""

from django.db import models
from django.utils import timezone

class PDFDocument(models.Model):
    """Model to store PDF document information."""
    
    title = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='pdfs/')
    upload_date = models.DateTimeField(default=timezone.now)
    file_size = models.BigIntegerField()
    page_count = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-upload_date']
    
    def __str__(self):
        return self.title

class PDFAnnotation(models.Model):
    """Model to store PDF annotations."""
    
    document = models.ForeignKey(PDFDocument, on_delete=models.CASCADE, related_name='annotations')
    page_number = models.IntegerField()
    annotation_type = models.CharField(max_length=50)  # highlight, note, bookmark, etc.
    content = models.TextField(blank=True)
    coordinates = models.JSONField()  # Store annotation coordinates
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['page_number', 'created_at']
    
    def __str__(self):
        return f"{self.document.title} - Page {self.page_number}"
