from django.contrib import admin
from .models import Note, BugReport


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "created_at", "updated_at")
    search_fields = ("title", "content")
    list_filter = ("created_at",)


@admin.register(BugReport)
class BugReportAdmin(admin.ModelAdmin):
    list_display = ("title", "priority", "user", "created_at")
    list_filter = ("priority", "created_at")
    search_fields = ("title", "description")
