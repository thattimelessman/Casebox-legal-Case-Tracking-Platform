from django.urls import path
from .views import RegisterView, MeView, UserListView, UserDetailView, approve_user

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("users/<int:pk>/approve/", approve_user, name="approve-user"),
]