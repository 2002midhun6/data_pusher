from django.db import models
from accounts.models import Account

class Destination(models.Model):

    HTTP_METHOD_CHOICES = (
        ('GET', 'GET'),
        ('POST', 'POST'),
        ('PUT', 'PUT'),
    )

    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='destinations'
    )
    url = models.URLField()
    http_method = models.CharField(max_length=10, choices=HTTP_METHOD_CHOICES)
    headers = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account.account_name} → {self.url}"
