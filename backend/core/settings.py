from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'replace-this-with-your-own-secret'

DEBUG = True

ALLOWED_HOSTS = ['*']

# APPS

INSTALLED_APPS = [

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # THIRD PARTY

    'rest_framework',

    'corsheaders',

    # APPS

    'users',

    'events',

    'bookings',

    'adminauth2',
]

# MIDDLEWARE

MIDDLEWARE = [

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# TEMPLATES

TEMPLATES = [
    {
        'BACKEND':
        'django.template.backends.django.DjangoTemplates',

        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [

                'django.template.context_processors.debug',

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# DATABASE

DATABASES = {
    'default': {

        'ENGINE':
        'django.db.backends.mysql',

        'NAME':
        'Ali',

        'USER':
        'root',

        'PASSWORD':
        'Ali@78612',

        'HOST':
        'localhost',

        'PORT':
        '3306',
    }
}

# PASSWORDS

AUTH_PASSWORD_VALIDATORS = [

    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# LANGUAGE

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# STATIC

STATIC_URL = 'static/'

# MEDIA

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'

# DEFAULT

DEFAULT_AUTO_FIELD = (
    'django.db.models.BigAutoField'
)

# CORS

CORS_ALLOW_ALL_ORIGINS = True

# REST FRAMEWORK

REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': (

        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_PERMISSION_CLASSES': (

        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

# EMAIL CONFIGURATION
# EMAIL CONFIGURATION

EMAIL_BACKEND = (
    'django.core.mail.backends.smtp.EmailBackend'
)

EMAIL_HOST = 'smtp.gmail.com'

EMAIL_PORT = 587

EMAIL_USE_TLS = True

# YOUR GMAIL

EMAIL_HOST_USER = (
    'shaikmehathafali786@gmail.com'
)

# GOOGLE APP PASSWORD

EMAIL_HOST_PASSWORD = (
    'wubkwkwyhrhgvrlg'
)

# DEFAULT SENDER

DEFAULT_FROM_EMAIL = (
    'EventEase <shaikmehathafali786@gmail.com>'
)