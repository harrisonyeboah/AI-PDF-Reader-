"""
URL configuration for pdf_reader app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # PDF Document endpoints
    path('pdf/', views.PDFDocumentListCreateView.as_view(), name='pdf-list-create'),
    path('pdf/<int:pk>/', views.PDFDocumentDetailView.as_view(), name='pdf-detail'),
    path('pdf/upload/', views.upload_pdf, name='pdf-upload'),
    path('pdf/<int:document_id>/info/', views.pdf_info, name='pdf-info'),
    
    # PDF Annotation endpoints
    path('pdf/<int:document_id>/annotations/', views.PDFAnnotationListCreateView.as_view(), name='annotation-list-create'),
    path('pdf/<int:document_id>/annotations/add/', views.add_annotation, name='add-annotation'),
]
