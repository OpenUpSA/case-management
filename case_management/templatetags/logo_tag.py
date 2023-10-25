from django import template
from django.conf import settings

register = template.Library()

# settings value


@register.simple_tag
def logo_url():
    if settings.LOGO_URL != None:
        return f'<img src={settings.LOGO_URL} />'
    else:
        return ''
