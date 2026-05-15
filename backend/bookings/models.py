from django.db import models
from django.contrib.auth.models import User
from events.models import Event

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, related_name='bookings', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name='bookings', on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    booking_date = models.DateField()
    total_amount = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.event.title}'
