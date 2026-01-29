from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from .models import Case

class CaseAccessMixin(LoginRequiredMixin):
    """
    Ensures the logged-in user is either the case owner or on the team.
    Use where self.get_object() returns a Case or an object with .case relation.
    """
    def has_case_access(self, case: Case) -> bool:
        user = self.request.user
        return case.owner_id == user.id or case.team.filter(id=user.id).exists() or user.is_superuser

    def dispatch(self, request, *args, **kwargs):
        resp = super().dispatch(request, *args, **kwargs)
        return resp

class ObjectCaseAccessMixin(CaseAccessMixin):
    """For CBVs working with objects: validates access to related Case before handling."""
    def dispatch(self, request, *args, **kwargs):
        obj = self.get_object()
        case = obj if hasattr(obj, "owner") and hasattr(obj, "team") else getattr(obj, "case", None)
        if case is None:
            raise PermissionDenied("Invalid object: missing case context.")
        if not self.has_case_access(case):
            raise PermissionDenied("You do not have permission to access this case.")
        return super(CaseAccessMixin, self).dispatch(request, *args, **kwargs)
