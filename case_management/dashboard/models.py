from django.db import models


class Report(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)
    description = models.TextField()

    def __str__(self):
        return self.name
