import json
from pathlib import Path

from django.core.management.base import BaseCommand

from events.models import Event, Service


class Command(BaseCommand):
    help = 'Seed events from frontend sample data JSON'

    def handle(self, *args, **options):
        fixtures_path = Path(__file__).resolve().parents[2] / 'fixtures' / 'sample_events.json'

        if not fixtures_path.exists():
            self.stderr.write(
                self.style.ERROR(
                    f'Missing {fixtures_path}. Run: npm run seed:events (from frontend folder)'
                )
            )
            return

        with fixtures_path.open(encoding='utf-8') as handle:
            events_data = json.load(handle)

        created = 0
        updated = 0

        for item in events_data:
            event, was_created = Event.objects.update_or_create(
                pk=item['id'],
                defaults={
                    'title': item['title'],
                    'description': item.get('description', ''),
                    'category': item.get('category', ''),
                    'location': item.get('location', ''),
                    'excerpt': item.get('excerpt', ''),
                    'images': item.get('images', []),
                    'pricing': item.get('pricing', []),
                },
            )

            Service.objects.filter(event=event).delete()
            for price_item in item.get('pricing', []):
                Service.objects.create(
                    event=event,
                    name=price_item['name'],
                    price=price_item['price'],
                    description=price_item.get('details', ''),
                )

            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded {len(events_data)} events ({created} created, {updated} updated).'
            )
        )
