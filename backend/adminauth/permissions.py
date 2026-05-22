from rest_framework.permissions import BasePermission


class IsAdminAli(BasePermission):
    """Checks JWT payload for is_admin=true."""

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        return bool(getattr(user, 'is_admin', False) or getattr(user, 'is_superuser', False))

