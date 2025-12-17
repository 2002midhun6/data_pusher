from django.contrib import admin
from .models import Account

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = (
        'account_name',
        'email',
        'account_id',
        'app_secret_token',
        'website',
        'created_at'
    )
    search_fields = ('email', 'account_name')
