from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from .validators import validate_file_extension, validate_file_size

User = settings.AUTH_USER_MODEL


class Case(models.Model):
    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("PENDING", "Pending"),
        ("CLOSED", "Closed"),
        ("ON_HOLD", "On Hold"),
    ]

    title = models.CharField(max_length=200)
    case_number = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    court = models.CharField(max_length=150, blank=True)
    filing_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="OPEN")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_cases")
    team = models.ManyToManyField(User, blank=True, related_name="shared_cases")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.case_number} – {self.title}"


class Party(models.Model):
    PARTY_TYPES = [
        ("PLAINTIFF", "Plaintiff"),
        ("DEFENDANT", "Defendant"),
        ("OTHER", "Other"),
    ]

    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="parties")
    name = models.CharField(max_length=200)
    party_type = models.CharField(max_length=20, choices=PARTY_TYPES, default="OTHER")
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)

    class Meta:
        ordering = ["party_type", "name"]

    def __str__(self):
        return f"{self.name} ({self.party_type})"


def document_upload_path(instance, filename):
    return f"case_{instance.case_id}/{filename}"


class Document(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=document_upload_path)
    original_filename = models.CharField(max_length=255, blank=True)
    content_type = models.CharField(max_length=100, blank=True)
    size = models.PositiveIntegerField(default=0)
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def clean(self):
        if self.file:
            validate_file_extension(self.file.name)
            validate_file_size(self.file)

    def save(self, *args, **kwargs):
        if self.file:
            self.size = self.file.size
            self.content_type = getattr(self.file, "content_type", "") or self.content_type
            if not self.original_filename:
                self.original_filename = getattr(self.file, "name", "")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Deadline(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="deadlines")
    title = models.CharField(max_length=200)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["is_completed", "due_date"]

    def clean(self):
        if not self.due_date:
            raise ValidationError("Due date is required.")

    @property
    def is_overdue(self):
        return (not self.is_completed) and self.due_date < timezone.localdate()

    def __str__(self):
        return f"{self.title} ({self.due_date})"
