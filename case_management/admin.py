from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

from case_management.models import LegalCase, CaseOffice, CaseType, Client, User, Meeting
from case_management.forms import UserCreationForm, UserChangeForm


class DefaultAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request):
        return True


class UserAdmin(UserAdmin, DefaultAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'name', 'membership_number', 'contact_number', 'case_office')}),
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


class CaseOfficeAdmin(DefaultAdmin):
    model = CaseOffice
    list_display = ['name']
    list_filter = ['name']


class CaseTypeAdmin(DefaultAdmin):
    model = CaseType
    list_display = ['title']
    list_filter = ['title']


class ClientAdmin(DefaultAdmin):
    model = Client
    list_display = ['name']
    list_filter = ['name']


class LegalCaseAdmin(DefaultAdmin):
    model = LegalCase
    list_display = ['case_number']
    list_filter = ['case_number']


class MeetingAdmin(DefaultAdmin):
    model = Meeting
    list_display = ['location', 'legal_case']
    list_filter = ['location', 'legal_case']


admin.site.register(CaseType, CaseTypeAdmin)
admin.site.register(CaseOffice, CaseOfficeAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(LegalCase, LegalCaseAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Meeting, MeetingAdmin)
