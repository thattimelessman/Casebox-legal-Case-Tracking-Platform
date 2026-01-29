from django.core.exceptions import ValidationError

ALLOWED_FILE_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
    ".png", ".jpg", ".jpeg"
}
MAX_FILE_SIZE_MB = 25

def validate_file_extension(filename: str):
    import os
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise ValidationError(f"Unsupported file type: {ext}. Allowed: {', '.join(sorted(ALLOWED_FILE_EXTENSIONS))}")

def validate_file_size(uploaded_file):
    size_mb = uploaded_file.size / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValidationError(f"File too large: {size_mb:.1f} MB. Max allowed {MAX_FILE_SIZE_MB} MB.")
