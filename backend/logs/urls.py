from django.urls import path
from .views import AccessLogListView

urlpatterns = [
    path("", AccessLogListView.as_view(), name="access-logs"),
]
