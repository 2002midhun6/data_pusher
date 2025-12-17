from django.contrib import admin
from .models import Destination

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = (
        'account',
        'url',
        'http_method',
        'created_at'
    )
    list_filter = ('http_method',)

