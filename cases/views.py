from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.db.models import Q, Count
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy, reverse
from django.utils import timezone
from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView

from .forms import CaseForm, PartyForm, DocumentForm, DeadlineForm
from .mixins import CaseAccessMixin, ObjectCaseAccessMixin
from .models import Case, Party, Document, Deadline

# ---------------- Dashboard ----------------

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "cases/dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        cases = Case.objects.filter(Q(owner=user) | Q(team=user)).distinct()
        today = timezone.localdate()
        upcoming = Deadline.objects.filter(case__in=cases, is_completed=False, due_date__gte=today).order_by("due_date")[:10]
        overdue = Deadline.objects.filter(case__in=cases, is_completed=False, due_date__lt=today).order_by("due_date")[:10]
        ctx.update({
            "case_count": cases.count(),
            "upcoming_deadlines": upcoming,
            "overdue_deadlines": overdue,
            "recent_documents": Document.objects.filter(case__in=cases).order_by("-uploaded_at")[:10],
        })
        return ctx

# ---------------- Case CRUD + Search ----------------

class CaseListView(LoginRequiredMixin, ListView):
    template_name = "cases/case_list.html"
    model = Case
    paginate_by = 10

    def get_queryset(self):
        user = self.request.user
        qs = Case.objects.filter(Q(owner=user) | Q(team=user)).distinct()
        q = self.request.GET.get("q", "").strip()
        status = self.request.GET.get("status", "").strip()
        date_from = self.request.GET.get("from", "").strip()
        date_to = self.request.GET.get("to", "").strip()

        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(case_number__icontains=q) |
                Q(court__icontains=q) |
                Q(description__icontains=q)
            )
        if status:
            qs = qs.filter(status=status)
        if date_from:
            qs = qs.filter(filing_date__gte=date_from)
        if date_to:
            qs = qs.filter(filing_date__lte=date_to)
        return qs

class CaseDetailView(ObjectCaseAccessMixin, DetailView):
    template_name = "cases/case_detail.html"
    model = Case

class CaseCreateView(LoginRequiredMixin, CreateView):
    template_name = "cases/case_form.html"
    form_class = CaseForm

    def form_valid(self, form):
        form.instance.owner = self.request.user
        messages.success(self.request, "Case created.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.object.pk])

class CaseUpdateView(ObjectCaseAccessMixin, UpdateView):
    template_name = "cases/case_form.html"
    form_class = CaseForm
    model = Case

    def dispatch(self, request, *args, **kwargs):
        obj = self.get_object()
        if not self.has_case_access(obj):
            raise PermissionDenied()
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Case updated.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.object.pk])

class CaseDeleteView(ObjectCaseAccessMixin, DeleteView):
    template_name = "cases/confirm_delete.html"
    model = Case
    success_url = reverse_lazy("cases:case_list")

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Case deleted.")
        return super().delete(request, *args, **kwargs)

# ---------------- Parties ----------------

class PartyCreateView(CaseAccessMixin, CreateView):
    template_name = "cases/party_form.html"
    form_class = PartyForm

    def dispatch(self, request, *args, **kwargs):
        self.case = get_object_or_404(Case, pk=self.kwargs["case_id"])
        if not self.has_case_access(self.case):
            raise PermissionDenied()
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.case = self.case
        messages.success(self.request, "Party added.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.case.pk])

class PartyUpdateView(ObjectCaseAccessMixin, UpdateView):
    template_name = "cases/party_form.html"
    form_class = PartyForm
    model = Party

    def form_valid(self, form):
        messages.success(self.request, "Party updated.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.object.case.pk])

class PartyDeleteView(ObjectCaseAccessMixin, DeleteView):
    template_name = "cases/confirm_delete.html"
    model = Party

    def get_success_url(self):
        messages.success(self.request, "Party deleted.")
        return reverse("cases:case_detail", args=[self.object.case.pk])

# ---------------- Deadlines ----------------

class DeadlineCreateView(CaseAccessMixin, CreateView):
    template_name = "cases/deadline_form.html"
    form_class = DeadlineForm

    def dispatch(self, request, *args, **kwargs):
        self.case = get_object_or_404(Case, pk=self.kwargs["case_id"])
        if not self.has_case_access(self.case):
            raise PermissionDenied()
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.case = self.case
        messages.success(self.request, "Deadline added.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.case.pk])

class DeadlineUpdateView(ObjectCaseAccessMixin, UpdateView):
    template_name = "cases/deadline_form.html"
    form_class = DeadlineForm
    model = Deadline

    def form_valid(self, form):
        messages.success(self.request, "Deadline updated.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.object.case.pk])

class DeadlineDeleteView(ObjectCaseAccessMixin, DeleteView):
    template_name = "cases/confirm_delete.html"
    model = Deadline

    def get_success_url(self):
        messages.success(self.request, "Deadline deleted.")
        return reverse("cases:case_detail", args=[self.object.case.pk])

# ---------------- Documents (secure upload & download) ----------------

class DocumentCreateView(CaseAccessMixin, CreateView):
    template_name = "cases/document_form.html"
    form_class = DocumentForm

    def dispatch(self, request, *args, **kwargs):
        self.case = get_object_or_404(Case, pk=self.kwargs["case_id"])
        if not self.has_case_access(self.case):
            raise PermissionDenied()
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        doc = form.save(commit=False)
        doc.case = self.case
        doc.uploaded_by = self.request.user
        doc.original_filename = form.cleaned_data["file"].name
        doc.content_type = getattr(form.cleaned_data["file"], "content_type", "")
        doc.save()
        messages.success(self.request, "Document uploaded.")
        return redirect("cases:case_detail", pk=self.case.pk)

class DocumentDeleteView(ObjectCaseAccessMixin, DeleteView):
    template_name = "cases/confirm_delete.html"
    model = Document

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Document deleted.")
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        return reverse("cases:case_detail", args=[self.object.case.pk])

@login_required
def document_download(request, pk: int):
    doc = get_object_or_404(Document, pk=pk)
    # Access check
    case = doc.case
    if not (case.owner_id == request.user.id or case.team.filter(id=request.user.id).exists() or request.user.is_superuser):
        raise PermissionDenied("You do not have permission to download this document.")
    try:
        response = FileResponse(doc.file.open("rb"), as_attachment=True, filename=doc.original_filename)
        # Security headers
        response["X-Content-Type-Options"] = "nosniff"
        response["Content-Type"] = doc.content_type or "application/octet-stream"
        return response
    except FileNotFoundError:
        raise Http404("File not found.")
