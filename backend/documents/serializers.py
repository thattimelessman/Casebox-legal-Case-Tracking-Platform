# documents/serializers.py
from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id", "case", "title", "file", "file_url",
            "uploaded_by", "uploaded_by_name",
            "side", "description", "upload_date",
            "is_visible_to_client", "file_size",
        ]
        read_only_fields = ["id", "upload_date", "uploaded_by"]

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return obj.uploaded_by.get_full_name() or obj.uploaded_by.username
        return None

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_file_size(self, obj):
        try:
            return obj.file.size
        except Exception:
            return None

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["uploaded_by"] = request.user
        return super().create(validated_data)
