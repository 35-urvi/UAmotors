from django.urls import path
from .views import create_bill, list_bills, get_bill, get_next_bill_no, BillListView, BillDetailView

urlpatterns = [
    path('create/', create_bill, name='create-bill'),
    path('history/', list_bills, name='list-bills'),
    path('<int:pk>/', get_bill, name='get-bill'),
    path('next-bill/', get_next_bill_no, name='next-bill'),
     path('bills/', BillListView.as_view(), name='bill-list'),
    path('bills/<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
]
