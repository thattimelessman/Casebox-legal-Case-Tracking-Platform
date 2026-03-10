# logs/models.py
from django.db import models
from django.conf import settings


class AccessLog(models.Model):
    ACTION_CHOICES = (
        ("login", "Login"),
        ("view_case", "View Case"),
        ("view_document", "View Document"),
        ("upload_document", "Upload Document"),
        ("edit_case", "Edit Case"),
        ("delete", "Delete"),
        ("approve_client", "Approve Client"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="access_logs",
    )
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user} – {self.action} at {self.timestamp}"
