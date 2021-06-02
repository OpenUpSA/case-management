from django.contrib import admin

from .models import Report

class ReportAdmin(admin.ModelAdmin):
    model = Report
    list_display = ['name']
    list_filter = ['name']

admin.site.register(Report, ReportAdmin)