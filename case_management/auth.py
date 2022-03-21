from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import BasePermission, DjangoModelPermissions
from django.core.exceptions import PermissionDenied

from case_management.enums import PermissionGroups

class BearerTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'

"""
TODO: Remove unnecessary has_object_permission implementations once issue fixed
(the ones simply returning `self.has_permission(request, view)`)

This weirdness is to work around this issue: https://github.com/encode/django-rest-framework/issues/7117
"""

class InAdminGroup(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.ADMIN)

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class InReportingGroup(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.REPORTING)

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class InAdviceOfficeAdminGroup(BasePermission):
    def has_permission(self, request, view):
        # TODO: add list queries to ensure filtered by case office
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.ADVICE_OFFICE_ADMIN)

    def has_object_permission(self, request, view, obj):
        return has_object_permission(request, view, obj)


class InCaseWorkerGroup(BasePermission):
    def has_permission(self, request, view):
        # TODO: add list queries to ensure filtered by case office
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.CASE_WORKER)

    def has_object_permission(self, request, view, obj):
        return has_object_permission(request, view, obj)


def has_object_permission(request, view, obj):
    permitted = False
    if view.basename == 'caseoffice':
        permitted = request.user.case_office.id == obj.id
    elif hasattr(obj, 'case_office'):
        permitted = request.user.case_office == obj.case_office
    elif hasattr(obj, 'case_offices'):
        permitted = request.user.case_office in obj.case_offices.all()
    return permitted


def permission_is_scoped(permission_group):
    return permission_group in (PermissionGroups.ADVICE_OFFICE_ADMIN, PermissionGroups.CASE_WORKER)


def view_allows_listing_without_filter(view):
    return hasattr(view, 'allow_listing_without_case_office_filter') and view.allow_listing_without_case_office_filter

def check_create_update_permission(request):
    if permission_is_scoped(request.user.permission_group):
        permitted = False
        if 'case_office' in request.data:
            permitted = request.user.case_office.id == request.data['case_office']
        elif 'case_offices' in request.data:
            permitted = len(request.data['case_offices']) == 1 and request.user.case_office.id == request.data['case_offices'][0]
        if not permitted:
            raise PermissionDenied


def check_scoped_list_permission(request, view):
    if permission_is_scoped(request.user.permission_group) and not view_allows_listing_without_filter(view):
        scope_filter = request.query_params.get(view.permission_scope_field)
        if scope_filter is None or int(scope_filter) not in view.permission_scope_field_case_offices:
            raise PermissionDenied


def check_scoped_reporting_permision(request):
    if permission_is_scoped(request.user.permission_group):
        case_office_filter = request.query_params.get('caseOffice')
        if case_office_filter is None or request.user.case_office.id != int(case_office_filter):
            raise PermissionDenied
