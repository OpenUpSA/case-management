from django.contrib import admin

from case_management.dashboard.models import Report

from case_management.admin import DefaultAdmin


class ReportAdmin(DefaultAdmin):
    model = Report
    list_display = ['name']
    list_filter = ['name']


admin.site.register(Report, ReportAdmin)
