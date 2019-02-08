# messaging/routing.py
                     
from django.urls import path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from .token_auth import TokenAuthMiddleware
from messaging import consumers
                     
                     
websocket_urlpatterns = [
    path('connect', consumers.ChatConsumer),
]

application = ProtocolTypeRouter({
	# (http->django views is added by default)
	'websocket': TokenAuthMiddleware(
		URLRouter(
			websocket_urlpatterns
		)
	),
})
