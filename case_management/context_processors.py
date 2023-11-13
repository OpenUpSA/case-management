from django.contrib import admin


def admin_header_processor(request):
    site_header = getattr(admin.site, 'site_header')
    site_title = getattr(admin.site, 'site_title')
    return {"site_header": site_header, "site_title": site_title}
