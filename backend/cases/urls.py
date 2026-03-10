from django.urls import path
from .views import CaseListCreateView, CaseDetailView, HearingNoteListCreateView

urlpatterns = [
    path("", CaseListCreateView.as_view(), name="case-list"),
    path("<int:pk>/", CaseDetailView.as_view(), name="case-detail"),
    path("<int:case_pk>/notes/", HearingNoteListCreateView.as_view(), name="hearing-notes"),
]