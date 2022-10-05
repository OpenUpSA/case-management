from django import template
import os

register = template.Library()

@register.filter
def get_env(key):
    return os.environ.get(key, None)
