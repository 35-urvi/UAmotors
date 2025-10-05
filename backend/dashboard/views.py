from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from billing.models import Bill, BillItem
import calendar


@api_view(['GET'])
def dashboard_stats(request):
    """Get overall dashboard statistics"""
    today = timezone.now().date()
    current_month = today.replace(day=1)
    
    # Total bills count
    total_bills = Bill.objects.count()
    
    # Today's bills
    today_bills = Bill.objects.filter(date=today).count()
    
    # This month's bills
    month_bills = Bill.objects.filter(date__gte=current_month).count()
    
    # Total revenue
    total_revenue = Bill.objects.aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # Today's revenue
    today_revenue = Bill.objects.filter(date=today).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # This month's revenue
    month_revenue = Bill.objects.filter(date__gte=current_month).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # This year's revenue
    current_year = today.year
    year_start = today.replace(month=1, day=1)
    year_revenue = Bill.objects.filter(date__gte=year_start).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # Average bill value
    avg_bill_value = 0
    if total_bills > 0:
        avg_bill_value = total_revenue / total_bills
    
    return Response({
        'total_bills': total_bills,
        'today_bills': today_bills,
        'month_bills': month_bills,
        'total_revenue': float(total_revenue),
        'today_revenue': float(today_revenue),
        'month_revenue': float(month_revenue),
        'year_revenue': float(year_revenue),
        'avg_bill_value': round(avg_bill_value, 2)
    })


@api_view(['GET'])
def recent_bills(request):
    """Get recent bills for dashboard"""
    recent_bills = Bill.objects.select_related().order_by('-created_at')[:10]
    
    bills_data = []
    for bill in recent_bills:
        bills_data.append({
            'id': bill.id,
            'bill_no': bill.bill_no,
            'date': bill.date,
            'customer_name': bill.customer_name,
            'vehicle_no': bill.vehicle_no,
            'total_amount': float(bill.total_amount)
        })
    
    return Response(bills_data)


@api_view(['GET'])
def monthly_revenue(request):
    """Get monthly revenue data for the last 12 months"""
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=365)
    
    # Get revenue data for each month
    monthly_data = []
    
    for i in range(12):
        month_start = (start_date + timedelta(days=30*i)).replace(day=1)
        if i == 11:
            month_end = end_date
        else:
            next_month = (month_start + timedelta(days=32)).replace(day=1)
            month_end = next_month - timedelta(days=1)
        
        month_revenue = Bill.objects.filter(
            date__gte=month_start,
            date__lte=month_end
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        monthly_data.append({
            'month': month_start.strftime('%Y-%m'),
            'month_name': month_start.strftime('%b %Y'),
            'revenue': float(month_revenue)
        })
    
    return Response(monthly_data)


@api_view(['GET'])
def top_services(request):
    """Get top services/particulars by frequency and revenue"""
    # Get top services by frequency
    top_by_frequency = BillItem.objects.values('particulars').annotate(
        count=Count('particulars'),
        total_revenue=Sum('amount')
    ).order_by('-count')[:10]
    
    # Get top services by revenue
    top_by_revenue = BillItem.objects.values('particulars').annotate(
        count=Count('particulars'),
        total_revenue=Sum('amount')
    ).order_by('-total_revenue')[:10]
    
    return Response({
        'by_frequency': list(top_by_frequency),
        'by_revenue': list(top_by_revenue)
    })


@api_view(['GET'])
def customer_stats(request):
    """Get customer statistics"""
    # Total unique customers
    total_customers = Bill.objects.values('customer_name').distinct().count()
    
    # Customers with multiple bills (returning customers)
    returning_customers = Bill.objects.values('customer_name').annotate(
        bill_count=Count('id')
    ).filter(bill_count__gt=1).count()
    
    # Top customers by revenue
    top_customers = Bill.objects.values('customer_name').annotate(
        total_revenue=Sum('total_amount'),
        bill_count=Count('id')
    ).order_by('-total_revenue')[:10]
    
    # Top customers by frequency
    frequent_customers = Bill.objects.values('customer_name').annotate(
        total_revenue=Sum('total_amount'),
        bill_count=Count('id')
    ).order_by('-bill_count')[:10]
    
    return Response({
        'total_customers': total_customers,
        'returning_customers': returning_customers,
        'top_by_revenue': list(top_customers),
        'top_by_frequency': list(frequent_customers)
    })
