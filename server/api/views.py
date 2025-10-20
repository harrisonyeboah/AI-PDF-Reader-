from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json


@csrf_exempt
@require_http_methods(["GET", "POST"])
def hello_world(request):
    """
    Simple API endpoint that returns Hello World
    """
    if request.method == 'GET':
        return JsonResponse({
            'message': 'Hello World!',
            'status': 'success',
            'method': 'GET'
        })
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            return JsonResponse({
                'message': 'Hello World!',
                'status': 'success',
                'method': 'POST',
                'received_data': data
            })
        except json.JSONDecodeError:
            return JsonResponse({
                'message': 'Hello World!',
                'status': 'success',
                'method': 'POST',
                'received_data': 'Invalid JSON'
            })


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint
    """
    return JsonResponse({
        'status': 'healthy',
        'message': 'Noto Server is running!'
    })
