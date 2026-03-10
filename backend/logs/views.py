# logs/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AccessLog
from rest_framework import serializers
from accounts.permissions import IsAdmin


class AccessLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = AccessLog
        fields = ["id", "user", "user_name", "action", "description", "ip_address", "timestamp"]

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Unknown"


class AccessLogListView(generics.ListAPIView):
    serializer_class = AccessLogSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return AccessLog.objects.select_related("user").all()[:200]
