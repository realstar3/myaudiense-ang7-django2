# """
# ASGI entrypoint. Configures Django and then runs the application
# defined in the ASGI_APPLICATION setting.
# """
#
# import os
# import django
# from channels.routing import get_default_application
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_project.settings")
# django.setup()
# application = get_default_application()
from channels.routing import ProtocolTypeRouter, URLRouter
from .token_auth import TokenAuthMiddleware

from . import routing

application = ProtocolTypeRouter({
	# (http->django views is added by default)
	'websocket': TokenAuthMiddleware(
		URLRouter(
			routing.websocket_urlpatterns
		)
	),
})
