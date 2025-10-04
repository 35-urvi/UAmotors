from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Hardcoded credentials


@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Hardcoded credentials
    if username == "uamotors" and password == "UAmotors@1234":
        return Response(
            {"message": "Login successful", "redirect": "/dashboard"},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )