from django.contrib import admin

from .models import CaseOffice, CaseType

class CaseOfficeAdmin(admin.ModelAdmin):
    model = CaseOffice
    list_display = ['name']
    list_filter = ['name']

class CaseTypeAdmin(admin.ModelAdmin):
    model = CaseType
    list_display = ['title']
    list_filter = ['title']


admin.site.register(CaseType, CaseTypeAdmin)
admin.site.register(CaseOffice, CaseOfficeAdmin)
