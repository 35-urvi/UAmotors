from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
from dotenv import load_dotenv


load_dotenv()  
# Hardcoded credentials


@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Get credentials from environment variables
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if username == admin_username and password == admin_password:
        return Response(
            {"message": "Login successful", "redirect": "/dashboard"},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )