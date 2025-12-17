from rest_framework import serializers
from .models import Destination
from accounts.models import Account
from urllib.parse import urlparse

class DestinationSerializer(serializers.ModelSerializer):

    def validate_url(self, value):
        if not value:
            raise serializers.ValidationError("Webhook URL is required.")

        parsed = urlparse(value)
        if not parsed.scheme or not parsed.netloc:
            raise serializers.ValidationError("Enter a valid URL.")

        return value

    def validate_http_method(self, value):
        allowed_methods = ['GET', 'POST', 'PUT']
        if value not in allowed_methods:
            raise serializers.ValidationError(
                f"HTTP method must be one of {allowed_methods}"
            )
        return value

    def validate_headers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Headers must be a JSON object.")

        # Optional: enforce Content-Type
        if "Content-Type" not in value:
            raise serializers.ValidationError(
                "Headers must include Content-Type."
            )

        return value

    def validate_account(self, value):
        if not Account.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid account.")
        return value

    class Meta:
        model = Destination
        fields = [
            'id',
            'account',
            'url',
            'http_method',
            'headers',
            'created_at'
        ]
        read_only_fields = ('id', 'created_at')
