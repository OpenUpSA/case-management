from django.db import models

class Report(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField()    

    def __str__(self):
        return self.name
