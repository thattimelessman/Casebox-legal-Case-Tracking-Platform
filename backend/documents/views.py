# documents/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer
from accounts.permissions import IsAdmin, IsApprovedClient


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdmin()]
        return [IsAuthenticated(), IsApprovedClient()]

    def get_queryset(self):
        user = self.request.user
        case_id = self.request.query_params.get("case")

        if user.role == "admin":
            qs = Document.objects.all()
        elif user.role == "client":
            qs = Document.objects.filter(
                case__client=user,
                is_visible_to_client=True,
            )
        elif user.role == "advocate":
            from django.db.models import Q
            qs = Document.objects.filter(
                Q(case__client_advocate=user) | Q(case__opposition_advocate=user)
            )
        elif user.role == "judge":
            qs = Document.objects.filter(case__judge=user)
        else:
            qs = Document.objects.none()

        if case_id:
            qs = qs.filter(case_id=case_id)

        return qs.select_related("case", "uploaded_by")

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx
