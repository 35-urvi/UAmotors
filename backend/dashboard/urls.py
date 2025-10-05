from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    path('recent-bills/', views.recent_bills, name='recent-bills'),
    path('monthly-revenue/', views.monthly_revenue, name='monthly-revenue'),
    path('top-services/', views.top_services, name='top-services'),
    path('customer-stats/', views.customer_stats, name='customer-stats'),
]
