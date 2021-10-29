# update_case_number_format added by rikusv

from django.db import migrations
from django.db.models.functions import Length


def update_case_number_format(apps, schema_editor):
    LegalCase = apps.get_model("case_management", "LegalCase")

    for obj in LegalCase.objects.annotate(case_number_len=Length("case_number")).filter(
        case_number_len=11
    ):
        obj.case_number = (
            f"{obj.case_number[0:3]}/{obj.case_number[3:7]}/{obj.case_number[7:]}"
        )
        obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ("case_management", "0013_legalcasefile"),
    ]

    operations = [
        migrations.RunPython(update_case_number_format, migrations.RunPython.noop),
    ]
