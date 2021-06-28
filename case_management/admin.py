from django.contrib import admin

from .models import CaseOffice, CaseType, Client

class CaseOfficeAdmin(admin.ModelAdmin):
    model = CaseOffice
    list_display = ['name']
    list_filter = ['name']

class CaseTypeAdmin(admin.ModelAdmin):
    model = CaseType
    list_display = ['title']
    list_filter = ['title']

class ClientAdmin(admin.ModelAdmin):
    model = Client
    list_display = ['name']
    list_filter = ['name']


admin.site.register(CaseType, CaseTypeAdmin)
admin.site.register(CaseOffice, CaseOfficeAdmin)
admin.site.register(Client, ClientAdmin)
