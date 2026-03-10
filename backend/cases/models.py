from django.db import models
from django.conf import settings


class Case(models.Model):
    STATUS_CHOICES = (
        ("ongoing", "Ongoing"),
        ("adjourned", "Adjourned"),
        ("judgement_reserved", "Judgement Reserved"),
        ("closed", "Closed"),
        ("disposed", "Disposed"),
    )

    CASE_TYPE_CHOICES = (
        ("civil", "Civil"),
        ("criminal", "Criminal"),
        ("family", "Family"),
        ("property", "Property"),
        ("labour", "Labour"),
        ("commercial", "Commercial"),
        ("constitutional", "Constitutional"),
        ("other", "Other"),
    )

    case_no = models.CharField(max_length=100, unique=True)
    case_title = models.CharField(max_length=255)
    case_type = models.CharField(max_length=30, choices=CASE_TYPE_CHOICES, default="civil")
    court_name = models.CharField(max_length=255)
    court_city = models.CharField(max_length=100, blank=True)

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="client_cases",
        on_delete=models.CASCADE,
    )
    judge = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="judge_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    client_advocate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="advocate_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    opposition_advocate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="opposition_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )

    filing_date = models.DateField(null=True, blank=True)
    next_hearing_date = models.DateField(null=True, blank=True)
    last_hearing_date = models.DateField(null=True, blank=True)

    last_verdict = models.TextField(blank=True, help_text="Summary of last hearing outcome")
    final_verdict = models.TextField(blank=True)
    case_summary = models.TextField(blank=True, help_text="Brief description of the case")

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="ongoing")

    # Progress tracking (0-100%)
    progress = models.PositiveSmallIntegerField(default=0, help_text="Case progress percentage")

    is_visible_to_client = models.BooleanField(
        default=True,
        help_text="Admin can hide sensitive cases from client view",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.case_no} – {self.case_title}"


class HearingNote(models.Model):
    """Notes from each hearing session."""
    case = models.ForeignKey(Case, related_name="hearing_notes", on_delete=models.CASCADE)
    hearing_date = models.DateField()
    next_date = models.DateField(null=True, blank=True)
    note = models.TextField()
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-hearing_date"]

    def __str__(self):
        return f"{self.case.case_no} – {self.hearing_date}"
