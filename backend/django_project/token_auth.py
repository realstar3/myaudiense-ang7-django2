from channels.auth import AuthMiddlewareStack
from auth_token.models import AuthToken
from django.contrib.auth.models import AnonymousUser

from rest_framework import exceptions
from django.core.exceptions import ValidationError


class TokenAuthMiddleware:
	"""
	Token authorization middleware for Django Channels 2
	"""

	def __init__(self, inner):
		self.inner = inner

	def __call__(self, scope):
		query_string = scope['query_string']
		if b'token' in query_string:

			token_name, token_key = query_string.decode().split("=")
			if token_name == 'token':
				user = None
				try:
					user = AuthToken.objects.is_token_valid(token=token_key)
					scope['user'] = user
				except ValidationError:
					pass
				if user is None:
					scope['user'] = AnonymousUser()

		return self.inner(scope)