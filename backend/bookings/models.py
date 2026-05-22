from django.db import models

from django.contrib.auth.models import User

from events.models import Event


class Booking(models.Model):

    # STATUS

    STATUS_CHOICES = [

        ('Pending', 'Pending'),

        ('Approved', 'Approved'),

        ('Rejected', 'Rejected'),
    ]

    # PAYMENT STATUS

    PAYMENT_STATUS_CHOICES = [

        ('unpaid', 'Unpaid'),

        (
            'pending_review',
            'Pending Review'
        ),

        (
            'paid_partial',
            'Advance Paid'
        ),

        (
            'paid_full',
            'Paid Full'
        ),
    ]

    # PAYMENT TYPE

    PAYMENT_TYPE_CHOICES = [

        ('advance', 'Advance'),

        ('full', 'Full'),
    ]

    # METHODS

    PAYMENT_METHOD_CHOICES = [

        ('upi', 'UPI'),

        (
            'card',
            'Credit / Debit Card'
        ),

        (
            'netbanking',
            'Net Banking'
        ),

        ('wallet', 'Wallet'),
    ]

    # USER

    user = models.ForeignKey(

        User,

        related_name='bookings',

        on_delete=models.CASCADE,

        null=True,

        blank=True,
    )

    # EVENT

    event = models.ForeignKey(

        Event,

        related_name='bookings',

        on_delete=models.CASCADE
    )

    # EVENT DETAILS

    location = models.CharField(

        max_length=255,

        blank=True,

        default=''
    )

    booking_date = models.DateField()

    guest_count = models.PositiveIntegerField(
        default=1
    )

    # CUSTOMER

    customer_name = models.CharField(

        max_length=100,

        blank=True,

        default=''
    )

    customer_phone = models.CharField(

        max_length=20,

        blank=True,

        default=''
    )

    customer_email = models.EmailField(

        blank=True,

        default=''
    )

    customer_address = models.TextField(

        blank=True,

        default=''
    )

    # PACKAGE

    package_items = models.JSONField(

        default=list,

        blank=True
    )

    subtotal = models.IntegerField(
        default=0
    )

    total_amount = models.IntegerField(
        default=0
    )

    advance_amount = models.IntegerField(
        default=0
    )

    remaining_amount = models.IntegerField(
        default=0
    )

    # PAYMENT

    payment_type = models.CharField(

        max_length=20,

        choices=PAYMENT_TYPE_CHOICES,

        default='advance',
    )

    payment_method = models.CharField(

        max_length=50,

        choices=PAYMENT_METHOD_CHOICES,

        blank=True,

        default='',
    )

    payment_status = models.CharField(

        max_length=30,

        choices=PAYMENT_STATUS_CHOICES,

        default='unpaid',
    )

    amount_paid = models.IntegerField(
        default=0
    )

    payment_photo = models.ImageField(

        upload_to='payment_photos/',

        null=True,

        blank=True
    )

    paid_at = models.DateTimeField(

        null=True,

        blank=True
    )

    # STATUS

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default='Pending'
    )

    is_confirmed = models.BooleanField(
        default=False
    )

    admin_notes = models.TextField(

        blank=True,

        default=''
    )

    # DATES

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # SAVE

    def save(
        self,
        *args,
        **kwargs
    ):

        # AUTO ADVANCE

        if (

            not self.advance_amount

            and self.total_amount

        ):

            self.advance_amount = round(

                self.total_amount * 0.5
            )

        # PREVENT OVERPAY

        if (
            self.amount_paid >
            self.total_amount
        ):

            self.amount_paid = (
                self.total_amount
            )

        # REMAINING

        self.remaining_amount = max(

            self.total_amount -
            self.amount_paid,

            0
        )

        # PAYMENT STATUS

        if self.amount_paid <= 0:

            self.payment_status = (
                'unpaid'
            )

        elif (

            self.amount_paid <
            self.total_amount

        ):

            self.payment_status = (
                'paid_partial'
            )

        else:

            self.payment_status = (
                'paid_full'
            )

        super().save(
            *args,
            **kwargs
        )

    # DISPLAY STATUS

    @property
    def display_status(self):

        if (

            self.payment_status ==
            'pending_review'

        ):

            return (
                'Payment Verification Pending'
            )

        if self.status == 'Approved':

            if (

                self.payment_status ==
                'paid_full'

            ):

                return 'Paid Full'

            if (

                self.payment_status ==
                'paid_partial'

            ):

                return 'Advance Paid'

            return 'Approved'

        return self.status

    # STRING

    def __str__(self):

        customer = (

            self.customer_name

            or (

                self.user.username

                if self.user

                else 'Guest'
            )
        )

        return (
            f'{customer} - '
            f'{self.event.title}'
        )