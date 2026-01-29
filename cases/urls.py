from django.urls import path
from . import views

app_name = "cases"   # optional but useful for reversing without specifying namespace externally

urlpatterns = [
    # Dashboard (home)
    path('', views.DashboardView.as_view(), name='dashboard'),

    # Case CRUD
    path('cases/', views.CaseListView.as_view(), name='case_list'),
    path('cases/new/', views.CaseCreateView.as_view(), name='case_create'),
    path('cases/<int:pk>/', views.CaseDetailView.as_view(), name='case_detail'),
    path('cases/<int:pk>/edit/', views.CaseUpdateView.as_view(), name='case_update'),
    path('cases/<int:pk>/delete/', views.CaseDeleteView.as_view(), name='case_delete'),

    # Parties
    path('cases/<int:case_id>/parties/new/', views.PartyCreateView.as_view(), name='party_create'),
    path('parties/<int:pk>/edit/', views.PartyUpdateView.as_view(), name='party_update'),
    path('parties/<int:pk>/delete/', views.PartyDeleteView.as_view(), name='party_delete'),

    # Deadlines
    path('cases/<int:case_id>/deadlines/new/', views.DeadlineCreateView.as_view(), name='deadline_create'),
    path('deadlines/<int:pk>/edit/', views.DeadlineUpdateView.as_view(), name='deadline_update'),
    path('deadlines/<int:pk>/delete/', views.DeadlineDeleteView.as_view(), name='deadline_delete'),

    # Documents
    path('cases/<int:case_id>/documents/new/', views.DocumentCreateView.as_view(), name='document_create'),
    path('documents/<int:pk>/download/', views.document_download, name='document_download'),
    path('documents/<int:pk>/delete/', views.DocumentDeleteView.as_view(), name='document_delete'),
]
