from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from .models import Bill
from .serializers import BillSerializer
from rest_framework import generics


@api_view(['GET'])
def get_next_bill_no(request):
    today = now().date()
    today_str = today.strftime("%d-%m-%Y")
    today_count = Bill.objects.filter(date=today).count() + 1
    bill_no = f"{today_str}/{today_count}"
    return Response({"bill_no": bill_no})

@api_view(['POST'])
def create_bill(request):
    serializer = BillSerializer(data=request.data)
    if serializer.is_valid():
        bill = serializer.save()
        return Response({
            "message": "Bill saved successfully",
            "bill_no": bill.bill_no
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_bills(request):
    bills = Bill.objects.all().order_by('-created_at')
    serializer = BillSerializer(bills, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_bill(request, pk):
    try:
        bill = Bill.objects.get(pk=pk)
        serializer = BillSerializer(bill)
        return Response(serializer.data)
    except Bill.DoesNotExist:
        return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)


# Fetch all bills
class BillListView(generics.ListAPIView):
    queryset = Bill.objects.all().order_by('-date')
    serializer_class = BillSerializer

# Fetch single bill by ID
class BillDetailView(generics.RetrieveAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer