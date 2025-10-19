"""
Views for PDF Reader app.
"""

import base64
import io
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PDFDocument, PDFAnnotation
from .serializers import PDFDocumentSerializer, PDFAnnotationSerializer, PDFUploadSerializer
import PyPDF2

class PDFDocumentListCreateView(generics.ListCreateAPIView):
    """View for listing and creating PDF documents."""
    
    queryset = PDFDocument.objects.all()
    serializer_class = PDFDocumentSerializer

class PDFDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting PDF documents."""
    
    queryset = PDFDocument.objects.all()
    serializer_class = PDFDocumentSerializer

class PDFAnnotationListCreateView(generics.ListCreateAPIView):
    """View for listing and creating PDF annotations."""
    
    serializer_class = PDFAnnotationSerializer
    
    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        return PDFAnnotation.objects.filter(document_id=document_id)

@api_view(['POST'])
def upload_pdf(request):
    """Handle PDF upload from Chrome extension."""
    
    serializer = PDFUploadSerializer(data=request.data)
    
    if serializer.is_valid():
        pdf_data = serializer.validated_data['pdf_data']
        filename = serializer.validated_data['filename']
        
        try:
            # Decode base64 PDF data
            pdf_bytes = base64.b64decode(pdf_data)
            
            # Create PDF document record
            pdf_doc = PDFDocument.objects.create(
                title=filename,
                filename=filename,
                file_size=len(pdf_bytes)
            )
            
            # Save PDF file
            pdf_doc.file_path.save(filename, io.BytesIO(pdf_bytes), save=True)
            
            # Get page count using PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
                pdf_doc.page_count = len(pdf_reader.pages)
                pdf_doc.save()
            except Exception as e:
                print(f"Error getting page count: {e}")
            
            return Response({
                'success': True,
                'message': 'PDF uploaded successfully',
                'document_id': pdf_doc.id,
                'page_count': pdf_doc.page_count
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error processing PDF: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def pdf_info(request, document_id):
    """Get PDF document information."""
    
    try:
        pdf_doc = PDFDocument.objects.get(id=document_id)
        serializer = PDFDocumentSerializer(pdf_doc)
        return Response(serializer.data)
    except PDFDocument.DoesNotExist:
        return Response({
            'error': 'PDF document not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_annotation(request, document_id):
    """Add annotation to PDF document."""
    
    try:
        pdf_doc = PDFDocument.objects.get(id=document_id)
        
        annotation_data = request.data.copy()
        annotation_data['document'] = pdf_doc.id
        
        serializer = PDFAnnotationSerializer(data=annotation_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except PDFDocument.DoesNotExist:
        return Response({
            'error': 'PDF document not found'
        }, status=status.HTTP_404_NOT_FOUND)
