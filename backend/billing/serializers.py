from rest_framework import serializers
from .models import Bill, BillItem

class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = ['id', 'particulars', 'quantity', 'rate', 'discount', 'amount']

class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True)

    class Meta:
        model = Bill
        fields = ['id', 'bill_no', 'date', 'customer_name', 'customer_address',
                  'customer_contact', 'vehicle_no', 'model', 'km', 'next_service_km',
                  'total_amount', 'items']
        read_only_fields = ['bill_no']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        bill = Bill.objects.create(**validated_data)

        # Save items linked to this bill
        for item_data in items_data:
            BillItem.objects.create(bill=bill, **item_data)

        # Recalculate total
        total = sum(item['quantity'] * item['rate'] - (item['quantity'] * item['rate'] * item['discount']) / 100 for item in items_data)
        bill.total_amount = total
        bill.save()

        return bill
