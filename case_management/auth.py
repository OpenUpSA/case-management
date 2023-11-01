from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import BasePermission, DjangoModelPermissions
from django.core.exceptions import PermissionDenied

from case_management.enums import PermissionGroups
from case_management.models import CaseOffice

import logging

logger = logging.getLogger(__name__)


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


class InReportingGroup(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.REPORTING)


class InAdviceOfficeAdminGroup(BasePermission):
    def has_permission(self, request, view):
        # TODO: add list queries to ensure filtered by case office
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.ADVICE_OFFICE_ADMIN)


class InCaseWorkerGroup(BasePermission):
    def has_permission(self, request, view):
        # TODO: add list queries to ensure filtered by case office
        return bool(request.user.is_authenticated and request.user.permission_group == PermissionGroups.CASE_WORKER)


def check_create_update_permission(request):
    if not request.user.is_authenticated:
        raise PermissionDenied


def check_scoped_list_permission(request, view):
    if not request.user.is_authenticated:
        raise PermissionDenied


def check_scoped_reporting_permision(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
