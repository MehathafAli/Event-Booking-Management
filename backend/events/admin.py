from django.contrib import admin
from .models import Event, Service


class ServiceInline(admin.TabularInline):
    model = Service
    extra = 1
    fields = ('name', 'price', 'description')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'location',
        'created_at',
    )
    list_filter = ('category', 'location')
    search_fields = ('title', 'category', 'location', 'excerpt')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': (
                'title',
                'category',
                'location',
                'excerpt',
                'description',
            )
        }),
        ('Pricing & Media', {
            'fields': (
                'pricing',
                'images',
            )
        }),
        ('Advanced', {
            'classes': ('collapse',),
            'fields': ('created_at',),
        }),
    )
    inlines = (ServiceInline,)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'price')
    list_filter = ('event',)
    search_fields = ('name', 'event__title')
