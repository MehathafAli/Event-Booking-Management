from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_booking_advance_amount_booking_amount_paid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='payment_photo',
            field=models.ImageField(blank=True, null=True, upload_to='payment_photos/'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

