from django.db import models

class CaseOffice(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField()    

    def __str__(self):
        return self.name


class CaseType(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title

