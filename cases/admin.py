from django.contrib import admin
from .models import Case, Party, Document, Deadline

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "case_number", "status", "owner", "filing_date")
    search_fields = ("title", "case_number", "court", "description")
    list_filter = ("status", "filing_date")
    autocomplete_fields = ("owner", "team")

@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "name", "party_type", "email")
    search_fields = ("name", "email", "phone")
    list_filter = ("party_type",)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "title", "uploaded_by", "size", "content_type", "uploaded_at")
    search_fields = ("title", "original_filename", "description")
    list_filter = ("uploaded_at",)

@admin.register(Deadline)
class DeadlineAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "title", "due_date", "is_completed")
    list_filter = ("is_completed", "due_date")
