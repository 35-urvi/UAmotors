from django.urls import path
from .views import create_bill, list_bills, get_bill, get_next_bill_no, delete_bill, update_bill, BillListView, BillDetailView

urlpatterns = [
    path('create/', create_bill, name='create-bill'),
    path('history/', list_bills, name='list-bills'),
    path('<int:pk>/', get_bill, name='get-bill'),
    path('<int:pk>/delete/', delete_bill, name='delete-bill'),
    path('<int:pk>/update/', update_bill, name='update-bill'),
    path('next-bill/', get_next_bill_no, name='next-bill'),
     path('bills/', BillListView.as_view(), name='bill-list'),
    path('bills/<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
]
