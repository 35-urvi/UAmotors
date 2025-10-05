from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from .models import Bill, BillItem
from decimal import Decimal, InvalidOperation
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

@api_view(['DELETE'])
def delete_bill(request, pk):
    try:
        bill = Bill.objects.get(pk=pk)
        bill.delete()
        return Response({"message": "Bill deleted successfully"}, status=status.HTTP_200_OK)
    except Bill.DoesNotExist:
        return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_bill(request, pk):
    """Update an existing bill and its items."""
    try:
        bill = Bill.objects.get(pk=pk)
    except Bill.DoesNotExist:
        return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    items_data = data.pop('items', [])

    # Update simple bill fields if present
    updatable_fields = [
        'date', 'customer_name', 'customer_address', 'customer_contact',
        'vehicle_no', 'model', 'km', 'next_service_km', 'total_amount'
    ]
    for field in updatable_fields:
        if field in data:
            setattr(bill, field, data[field])

    # Replace items with provided set (idempotent update)
    if items_data is not None:
        bill.items.all().delete()

        def to_int(value, default=0):
            try:
                return int(value)
            except (TypeError, ValueError):
                try:
                    return int(float(value))
                except (TypeError, ValueError):
                    return default

        def to_decimal(value, default=Decimal('0')):
            try:
                return Decimal(str(value))
            except (InvalidOperation, TypeError, ValueError):
                return default

        running_total = Decimal('0')
        for item in items_data:
            qty = to_int(item.get('quantity', 1), 1)
            rate = to_decimal(item.get('rate', 0), Decimal('0'))
            line_total = to_decimal(qty) * rate

            BillItem.objects.create(
                bill=bill,
                particulars=item.get('particulars', ''),
                quantity=qty,
                rate=rate,
            )

            running_total += line_total

        # Recalculate total_amount from items
        bill.total_amount = running_total

    bill.save()

    serializer = BillSerializer(bill)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Fetch all bills
class BillListView(generics.ListAPIView):
    queryset = Bill.objects.all().order_by('-date')
    serializer_class = BillSerializer

# Fetch single bill by ID
class BillDetailView(generics.RetrieveAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer