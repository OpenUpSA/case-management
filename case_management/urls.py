from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from . import views
from case_management.views import (
    MeetingViewSet,
    LegalCaseViewSet,
    CaseOfficeViewSet,
    CaseTypeViewSet,
    ClientViewSet,
    CustomObtainAuthToken,
    UserViewSet,
    LogViewSet,
    LegalCaseFileViewSet,
    monthly_summary,
    daily_summary,
)

router = DefaultRouter()
router.register(r'api/v1/meetings', MeetingViewSet)
router.register(r'api/v1/cases', LegalCaseViewSet)
router.register(r'api/v1/clients', ClientViewSet)
router.register(r'api/v1/case-offices', CaseOfficeViewSet)
router.register(r'api/v1/case-types', CaseTypeViewSet)
router.register(r'api/v1/users', UserViewSet)
router.register(r'api/v1/logs', LogViewSet)
router.register(r'api/v1/files', LegalCaseFileViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Case Management API",
        default_version='v1',
        description="The Case Management API",
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path(
        "dashboard",
        include("case_management.dashboard.urls"),
    ),
    path("admin/", admin.site.urls),
    path('api/v1/authenticate', CustomObtainAuthToken.as_view()),
    path(r'', include(router.urls)),
    re_path(
        r'^api/v1(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json',
    ),
    path('api/v1/reports/monthly-summary', monthly_summary, name='monthly-summary'),
    path('api/v1/reports/daily-summary', daily_summary, name='daily-summary'),
    path(
        'api/ui/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui',
    ),
]
