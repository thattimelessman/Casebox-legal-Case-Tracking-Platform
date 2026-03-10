from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("advocate", "Advocate"),
        ("judge", "Judge"),
        ("client", "Client"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="client")
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    # Client-specific: must be approved by admin before they can log in
    is_approved = models.BooleanField(
        default=False,
        help_text="Admin must approve client accounts before they can access the system.",
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="approved_users",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    profile_note = models.TextField(blank=True, help_text="Admin notes about this user")

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def can_access(self):
        """Non-client roles always have access; clients need admin approval."""
        if self.role != "client":
            return True
        return self.is_approved
