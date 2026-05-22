from rest_framework.permissions import BasePermission

ADMIN_USERNAME = 'Ali'


class IsAdminAli(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        return user.username == ADMIN_USERNAME or getattr(user, 'is_superuser', False)
