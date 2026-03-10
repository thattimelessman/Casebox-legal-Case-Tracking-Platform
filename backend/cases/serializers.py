from rest_framework import serializers
from .models import Case, HearingNote


class HearingNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = HearingNote
        fields = ["id", "note", "created_by", "created_by_name", "created_at"]
        read_only_fields = ["created_by", "created_at"]

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None


class CaseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    assigned_judge_name = serializers.SerializerMethodField()
    notes = HearingNoteSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = [
            "id", "title", "description", "status",
            "created_by", "created_by_name",
            "assigned_judge", "assigned_judge_name",
            "created_at", "notes",
        ]
        read_only_fields = ["created_by", "created_at"]

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None

    def get_assigned_judge_name(self, obj):
        if obj.assigned_judge:
            return obj.assigned_judge.get_full_name() or obj.assigned_judge.username
        return None

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)