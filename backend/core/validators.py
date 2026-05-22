import re

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email

PHONE_DIGITS_RE = re.compile(r'^[6-9]\d{9}$')
EMAIL_EXTRA_RE = re.compile(
    r'^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@'
    r'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,10})+$'
)

INVALID_EMAIL_DOMAINS = {
    'gmai.com', 'gmial.com', 'gmil.com', 'gnail.com', 'gmail.co', 'gmail.con',
    'gmal.com', 'yaho.com', 'yahooo.com', 'yahho.com', 'hotmial.com',
    'hotmil.com', 'outlok.com', 'outllok.com', 'rediffmail.co', 'icloud.co',
}

EMAIL_DOMAIN_TYPOS = {
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
}


def normalize_phone(value):
    if not value:
        return ''
    cleaned = re.sub(r'[\s\-().]', '', str(value).strip())
    if cleaned.startswith('+91'):
        cleaned = cleaned[3:]
    elif cleaned.startswith('91') and len(cleaned) == 12:
        cleaned = cleaned[2:]
    elif cleaned.startswith('0') and len(cleaned) == 11:
        cleaned = cleaned[1:]
    return cleaned


def validate_phone_number(value):
    cleaned = normalize_phone(value)
    if not PHONE_DIGITS_RE.match(cleaned):
        raise ValidationError(
            'Enter a valid 10-digit Indian mobile number (e.g. 9876543210).'
        )
    return cleaned


def validate_email_address(value):
    email = (value or '').strip().lower()
    if not email:
        raise ValidationError('Email is required.')
    try:
        django_validate_email(email)
    except ValidationError:
        raise ValidationError('Enter a valid email address (e.g. name@example.com).')
    if not EMAIL_EXTRA_RE.match(email):
        raise ValidationError('Enter a valid email address (e.g. name@gmail.com).')

    local, _, domain = email.partition('@')
    if not domain:
        raise ValidationError('Enter a valid email address (e.g. name@gmail.com).')

    if domain in EMAIL_DOMAIN_TYPOS:
        raise ValidationError(
            f'Did you mean {local}@{EMAIL_DOMAIN_TYPOS[domain]}?'
        )
    if domain in INVALID_EMAIL_DOMAINS:
        raise ValidationError(
            'This email domain looks incorrect. Use a valid address (e.g. name@gmail.com).'
        )

    labels = domain.split('.')
    if any(not label or len(label) < 2 for label in labels):
        raise ValidationError('Enter a valid email address (e.g. name@gmail.com).')

    tld = labels[-1]
    if len(tld) < 2 or len(tld) > 10:
        raise ValidationError('Enter a valid email address (e.g. name@gmail.com).')

    return email
