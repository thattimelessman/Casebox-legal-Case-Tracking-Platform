
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Admin dashboard (Django's built-in admin)
    path('admin/', admin.site.urls),

    # Authentication routes (login & logout). We use the built-in auth views
    # and specify a custom template for the login form.
    path('accounts/login/', auth_views.LoginView.as_view(template_name='cases/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),

    # Hand off all remaining root-level URLs to the "cases" app.
    # This means: requests starting with '' (the site root) will be matched
    # against cases.urls.
    path('', include(('cases.urls', 'cases'), namespace='cases')),
]

# Development-only: serve media files from MEDIA_URL/ during runserver.
# Do NOT use this in production; use a proper file server or cloud storage.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
