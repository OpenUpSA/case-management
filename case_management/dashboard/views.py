from django.views import generic


class Index(generic.TemplateView):
    template_name = "dashboard/index.html"
