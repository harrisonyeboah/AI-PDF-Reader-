"""
Admin configuration for PDF Reader app.
"""

from django.contrib import admin
from .models import PDFDocument, PDFAnnotation

@admin.register(PDFDocument)
class PDFDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'filename', 'upload_date', 'file_size', 'page_count']
    list_filter = ['upload_date']
    search_fields = ['title', 'filename']
    readonly_fields = ['upload_date']

@admin.register(PDFAnnotation)
class PDFAnnotationAdmin(admin.ModelAdmin):
    list_display = ['document', 'page_number', 'annotation_type', 'created_at']
    list_filter = ['annotation_type', 'created_at', 'page_number']
    search_fields = ['document__title', 'content']
    readonly_fields = ['created_at']
