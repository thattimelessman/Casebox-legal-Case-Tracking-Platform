"""
Management command: python manage.py create_admin

Creates the CaseBox admin superuser using credentials from .env
Run once after first migration. Safe to re-run (idempotent).
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Create the CaseBox admin superuser from environment variables"

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME", "admin")
        password = os.getenv("ADMIN_PASSWORD")

        if not password:
            self.stderr.write(
                self.style.ERROR(
                    "ADMIN_PASSWORD not set in .env — aborting for security."
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f"Admin user '{username}' already exists. Skipping.")
            )
            return

        User.objects.create_superuser(
            username=username,
            password=password,
            email=os.getenv("ADMIN_EMAIL", "admin@casebox.law"),
            role="admin",
            is_approved=True,
            first_name="CaseBox",
            last_name="Admin",
        )
        self.stdout.write(
            self.style.SUCCESS(f"✅ Admin user '{username}' created successfully.")
        )
