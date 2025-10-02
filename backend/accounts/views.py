from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Hardcoded credentials
ADMIN_USERNAME = "uamotors123"
ADMIN_PASSWORD = "UAmotors@123"

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            username = data.get("username")
            password = data.get("password")

            if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
                return JsonResponse({
                    "success": True,
                    "token": "fake-jwt-token-12345"  # simple token
                })
            else:
                return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"success": False, "error": "Only POST allowed"}, status=405)
