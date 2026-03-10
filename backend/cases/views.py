from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Case, HearingNote
from .serializers import CaseSerializer, HearingNoteSerializer


class CaseListCreateView(generics.ListCreateAPIView):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["admin", "judge"]:
            return Case.objects.all().order_by("-created_at")
        return Case.objects.filter(created_by=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["admin", "judge"]:
            return Case.objects.all()
        return Case.objects.filter(created_by=user)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)


class HearingNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = HearingNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HearingNote.objects.filter(
            case_id=self.kwargs["case_pk"]
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            case_id=self.kwargs["case_pk"],
        )