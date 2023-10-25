from django import template
from django.conf import settings

register = template.Library()

# settings value


@register.simple_tag
def logo_url():
    return settings.LOGO_URL
