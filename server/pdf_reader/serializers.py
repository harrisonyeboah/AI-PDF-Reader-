"""
Serializers for PDF Reader app.
"""

from rest_framework import serializers
from .models import PDFDocument, PDFAnnotation

class PDFDocumentSerializer(serializers.ModelSerializer):
    """Serializer for PDFDocument model."""
    
    class Meta:
        model = PDFDocument
        fields = ['id', 'title', 'filename', 'file_path', 'upload_date', 'file_size', 'page_count']
        read_only_fields = ['id', 'upload_date']

class PDFAnnotationSerializer(serializers.ModelSerializer):
    """Serializer for PDFAnnotation model."""
    
    class Meta:
        model = PDFAnnotation
        fields = ['id', 'document', 'page_number', 'annotation_type', 'content', 'coordinates', 'created_at']
        read_only_fields = ['id', 'created_at']

class PDFUploadSerializer(serializers.Serializer):
    """Serializer for PDF upload from Chrome extension."""
    
    pdf_data = serializers.CharField()
    filename = serializers.CharField()
    
    def validate_pdf_data(self, value):
        """Validate PDF data format."""
        if not value:
            raise serializers.ValidationError("PDF data cannot be empty.")
        return value
