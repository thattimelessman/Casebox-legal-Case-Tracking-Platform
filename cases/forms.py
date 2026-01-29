from django import forms
from django.utils import timezone
from .models import Case, Party, Document, Deadline
from .validators import validate_file_extension, validate_file_size


# 🧩 Base form to apply Bootstrap styling automatically to all fields
class StyledFormMixin:
    """Automatically adds Bootstrap 'form-control' classes to form fields."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            css_class = field.widget.attrs.get("class", "")
            # If it's a checkbox or radio button, skip form-control
            if isinstance(field.widget, (forms.CheckboxInput, forms.RadioSelect)):
                field.widget.attrs["class"] = css_class
            else:
                field.widget.attrs["class"] = f"{css_class} form-control".strip()


# 🧱 CASE FORM
class CaseForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Case
        fields = [
            "title",
            "case_number",
            "description",
            "court",
            "filing_date",
            "status",
            "team",
        ]
        widgets = {
            "filing_date": forms.DateInput(attrs={"type": "date"}),
            "description": forms.Textarea(attrs={"rows": 3, "placeholder": "Enter case details..."}),
            "team": forms.SelectMultiple(attrs={"size": 6}),
        }

    def clean_case_number(self):
        case_number = self.cleaned_data["case_number"]
        if Case.objects.filter(case_number=case_number).exists():
            raise forms.ValidationError("A case with this number already exists.")
        return case_number


# ⚖️ PARTY FORM
class PartyForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Party
        fields = ["name", "party_type", "email", "phone"]
        widgets = {
            "email": forms.EmailInput(attrs={"placeholder": "example@email.com"}),
            "phone": forms.TextInput(attrs={"placeholder": "+91XXXXXXXXXX"}),
        }


# 📄 DOCUMENT FORM
class DocumentForm(StyledFormMixin, forms.ModelForm):
    file = forms.FileField(
        help_text="Allowed file types: pdf, doc, docx, xls, xlsx, txt, png, jpg, jpeg (max size: 10MB)"
    )

    class Meta:
        model = Document
        fields = ["title", "description", "file"]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 3, "placeholder": "Briefly describe the document"}),
        }

    def clean_file(self):
        f = self.cleaned_data.get("file")
        if not f:
            raise forms.ValidationError("Please upload a file.")
        validate_file_extension(f.name)
        validate_file_size(f)
        return f


# ⏰ DEADLINE FORM
class DeadlineForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Deadline
        fields = ["title", "due_date", "is_completed", "notes"]
        widgets = {
            "due_date": forms.DateInput(attrs={"type": "date"}),
            "notes": forms.Textarea(attrs={"rows": 3, "placeholder": "Additional notes about this deadline..."}),
        }

    def clean_due_date(self):
        d = self.cleaned_data.get("due_date")
        if not d:
            raise forms.ValidationError("Due date is required.")
        if d.year < timezone.now().year - 50:
            raise forms.ValidationError("Due date seems too far in the past.")
        return d
