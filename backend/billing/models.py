from django.db import models
from django.utils.timezone import now

class Bill(models.Model):
    bill_no = models.CharField(max_length=20, unique=True)   # auto-generated
    date = models.DateField(default=now)
    customer_name = models.CharField(max_length=200)
    customer_address = models.TextField(blank=True, null=True)
    customer_contact = models.CharField(max_length=20, blank=True, null=True)
    vehicle_no = models.CharField(max_length=50, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    km = models.IntegerField(blank=True, null=True)
    next_service_km = models.IntegerField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Generate bill_no if not already set
        if not self.bill_no:
            today = now().date()
            today_str = today.strftime("%d-%m-%Y")

            # Count bills already created today
            today_count = Bill.objects.filter(date=today).count() + 1

            self.bill_no = f"{today_str}/{today_count}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bill {self.bill_no} - {self.customer_name}"


class BillItem(models.Model):
    bill = models.ForeignKey(Bill, related_name="items", on_delete=models.CASCADE)
    particulars = models.CharField(max_length=200)
    quantity = models.IntegerField(default=1)
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # Calculate amount automatically: (qty × rate) - discount%
        gross = self.quantity * self.rate
        discount_amt = (gross * self.discount) / 100
        self.amount = gross - discount_amt
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.particulars} ({self.bill.bill_no})"
