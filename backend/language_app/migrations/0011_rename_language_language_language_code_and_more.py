# Generated by Django 4.1.3 on 2023-12-11 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('language_app', '0010_language'),
    ]

    operations = [
        migrations.RenameField(
            model_name='language',
            old_name='language',
            new_name='language_code',
        ),
        migrations.AddField(
            model_name='language',
            name='language_name',
            field=models.TextField(null=True),
        ),
    ]
