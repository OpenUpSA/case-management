from django.contrib import admin
from django.urls import include, path

from rest_framework.authtoken import views as authviews
from . import views


urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    
    path("dashboard", include("case_management.dashboard.urls"),),
    path("admin/", admin.site.urls),

    path('api/v1/case-offices', views.case_offices, name="case_offices"),
    path('api/v1/case-types', views.case_types, name="case_types"),
    path('api/v1/clients', views.clients, name="clients"),
    path('api/v1/cases', views.cases, name="cases"),
    path('api/v1/authenticate', authviews.obtain_auth_token),
]
