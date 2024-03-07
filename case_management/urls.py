from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter
from django.http import HttpResponse
from django.contrib.auth import views as auth_views
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from django.conf import settings
from django.conf.urls.static import static


from . import views
from case_management.views import (
    LegalCaseReferralViewSet,
    LegalCaseViewSet,
    CaseOfficeViewSet,
    CaseTypeViewSet,
    CaseUpdateViewSet,
    FileViewSet,
    ClientFileViewSet,
    MeetingViewSet,
    NoteViewSet,
    ClientViewSet,
    ClientDependentViewSet,
    CustomObtainAuthToken,
    UserListViewSet,
    UserViewSet,
    LogViewSet,
    LanguageViewSet,
    SiteNoticeViewSet,
    SettingViewSet,
    range_summary,
    monthly_summary,
    daily_summary,
)

# Note: For Sentry integration testing


def trigger_error(request):
    division_by_zero = 1 / 0


router = DefaultRouter()
router.register(r'api/v1/cases', LegalCaseViewSet)
router.register(r'api/v1/referrals', LegalCaseReferralViewSet)
router.register(r'api/v1/clients', ClientViewSet, basename='Client')
router.register(r'api/v1/client-dependents', ClientDependentViewSet)
router.register(r'api/v1/case-offices', CaseOfficeViewSet)
router.register(r'api/v1/case-types', CaseTypeViewSet)
router.register(r'api/v1/case-updates', CaseUpdateViewSet)
router.register(r'api/v1/files', FileViewSet)
router.register(r'api/v1/client-files', ClientFileViewSet)
router.register(r'api/v1/meetings', MeetingViewSet)
router.register(r'api/v1/notes', NoteViewSet)
router.register(r'api/v1/users', UserListViewSet)
router.register(r'api/v1/users', UserViewSet)
router.register(r'api/v1/logs', LogViewSet)
router.register(r'api/v1/languages', LanguageViewSet)
router.register(r'api/v1/site-notices', SiteNoticeViewSet, basename='SiteNotice')
router.register(r'api/v1/settings', SettingViewSet)

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
    path("admin/", admin.site.urls),
    path('api/v1/authenticate', CustomObtainAuthToken.as_view()),
    path(r'', include(router.urls)),
    re_path(
        r'^api/v1(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json',
    ),
    path('api/v1/reports/range-summary', range_summary, name='range-summary'),
    path('api/v1/reports/monthly-summary',
         monthly_summary, name='monthly-summary'),
    path('api/v1/reports/daily-summary', daily_summary, name='daily-summary'),
    path(
        'api/ui/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui',
    ),
    path(
        'robots.txt',
        view=lambda r: HttpResponse(
            "User-agent: *\nAllow: /\n",
            content_type="text/plain")
    ),
    path('password-reset/',
         auth_views.PasswordResetView.as_view(

         ),
         name='admin_password_reset'),

    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(),
         name='password_reset_done'),

    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),

    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),

    path('debug/bnp6tVkWRPhVUd5ieGij-sentry/', trigger_error),

]

# default: "Django Administration"
admin.site.site_header = 'CaseFile'
# default: "Site administration"
admin.site.index_title = 'Admin'
admin.site.site_title = 'CaseFile'  # default: "Django site admin"
