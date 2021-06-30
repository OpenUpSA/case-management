from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

from case_management.models import Case, CaseOffice, CaseType, Client, User, Meeting
from case_management.forms import UserCreationForm, UserChangeForm


class UserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)


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


class CaseAdmin(admin.ModelAdmin):
    model = Case
    list_display = ['case_number']
    list_filter = ['case_number']

class MeetingAdmin(admin.ModelAdmin):
    model = Meeting
    list_display = ['location', 'case']
    list_filter = ['location', 'case']


admin.site.register(CaseType, CaseTypeAdmin)
admin.site.register(CaseOffice, CaseOfficeAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Case, CaseAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Meeting, MeetingAdmin)
