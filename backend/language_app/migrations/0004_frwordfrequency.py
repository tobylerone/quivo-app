# Generated by Django 4.1.3 on 2023-11-27 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('language_app', '0003_alter_frsentence_average_count_rank_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FrWordFrequency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.DecimalField(decimal_places=4, max_digits=10, null=True)),
                ('word', models.TextField(max_length=20, null=True)),
                ('frequency', models.IntegerField(max_length=10, null=True)),
            ],
        ),
    ]
