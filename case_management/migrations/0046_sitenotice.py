# Generated by Django 3.2.21 on 2023-10-19 08:34

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0045_alter_user_permission_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteNotice',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=False)),
                ('title', models.CharField(max_length=255)),
                ('message', ckeditor.fields.RichTextField()),
            ],
        ),
    ]
