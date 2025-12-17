import uuid
from django.db import models
import secrets

class Account(models.Model):
    email = models.EmailField(unique=True)
    account_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    account_name = models.CharField(max_length=100)
    app_secret_token = models.CharField(max_length=255, unique=True,editable=False,   # 👈 KEY FIX
        blank=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.account_name
    def save(self, *args, **kwargs):
        if not self.app_secret_token:
            self.app_secret_token = secrets.token_hex(32)
        super().save(*args, **kwargs)
