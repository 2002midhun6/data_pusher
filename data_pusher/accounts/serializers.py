from rest_framework import serializers
from .models import Account
import re

class AccountSerializer(serializers.ModelSerializer):

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")

        # EmailField already checks format, this is extra safety
        if Account.objects.filter(email=value).exists():
            # Allow same email when updating the same record
            if self.instance and self.instance.email == value:
                return value
            raise serializers.ValidationError("Email already exists.")

        return value.lower()

    def validate_account_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Account name is required.")

        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Account name must be at least 3 characters long."
            )

        # Optional: allow only letters, numbers and spaces
        if not re.match(r"^[A-Za-z0-9 ]+$", value):
            raise serializers.ValidationError(
                "Account name can contain only letters, numbers and spaces."
            )

        return value.strip()

    class Meta:
        model = Account
        fields = [
            'id',
            'email',
            'account_id',
            'account_name',
            'app_secret_token',
            'website',
            'created_at'
        ]
        read_only_fields = ('id', 'account_id', 'app_secret_token', 'created_at')
