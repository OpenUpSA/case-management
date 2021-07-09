
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as authviews

from . import views
from case_management.views import MeetingViewSet, LegalCaseViewSet, CaseOfficeViewSet, CaseTypeViewSet, ClientViewSet

router = DefaultRouter()
router.register(r'api/v1/meetings', MeetingViewSet)
router.register(r'api/v1/cases', LegalCaseViewSet)
router.register(r'api/v1/clients', ClientViewSet)
router.register(r'api/v1/case-offices', CaseOfficeViewSet)
router.register(r'api/v1/case-types', CaseTypeViewSet)

urlpatterns = [
    path("", views.Index.as_view(), name="index"),

    path("dashboard", include("case_management.dashboard.urls"),),
    path("admin/", admin.site.urls),
    path('api/v1/authenticate', authviews.obtain_auth_token),
    path(r'', include(router.urls)),
]
