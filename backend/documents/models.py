# documents/models.py
from django.db import models
from django.conf import settings
from cases.models import Case


class Document(models.Model):
    SIDE_CHOICES = (
        ("client", "Client"),
        ("opposition", "Opposition"),
        ("court", "Court"),
        ("other", "Other"),
    )

    case = models.ForeignKey(Case, related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="case_documents/%Y/%m/")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    side = models.CharField(max_length=20, choices=SIDE_CHOICES, default="client")
    description = models.TextField(blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    is_visible_to_client = models.BooleanField(default=True)

    class Meta:
        ordering = ["-upload_date"]

    def __str__(self):
        return f"{self.case.case_no} – {self.title}"
