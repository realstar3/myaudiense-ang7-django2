# -*- coding: utf-8 -*-
# from __future__ import unicode_literals
import uuid
from django.utils import timezone
from datetime import timedelta
from django.db import models
from django_project.models import TimestampModel
from django.contrib.auth.models import User, Group



def get_expiry():
	return timezone.now() + timedelta(days=1)


class AuthTokenManager(models.Manager):

	def expire_old_tokens_by_user(self, user):
		self.filter(user=user).update(is_expired=True)

	def expire_token(self, token):
		self.filter(token=token).update(is_expired=True)

	def expire_all_tokens(self, user):
		self.filter(user=user).update(is_expired=True)

	def is_token_exist(self, token):
		return AuthToken.objects.filter(token=token)

	def is_token_valid(self, token):
		auth_token = AuthToken.objects.filter(token=token).first()
		if auth_token:
			if not auth_token.is_expired:
				if auth_token.expiry_datetime > timezone.now():
					return auth_token.user
				else:
					auth_token.is_expired = True
					auth_token.save()
		return False

	def get_latest_auth_token_by_user(self, user):
		auth_token = AuthToken.objects.filter(
			token=user).latest('created_date')
		return auth_token


class AuthToken(TimestampModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE,)
	token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
	expiry_datetime = models.DateTimeField(default=get_expiry)
	is_expired = models.BooleanField(default=False)

	objects = AuthTokenManager()


class Profile(TimestampModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE, )
	image = models.TextField(default='')
	friend = models.TextField(default='')
	gender = models.BooleanField(default=True)
	location = models.CharField(max_length=300, default='')


class Review(TimestampModel):
	event_text = models.TextField()
	user = models.CharField(max_length=100, blank=False, null=True)
	sender = models.CharField(max_length=100, blank=False, null=True)
	feedback = models.TextField()
	is_positive = models.BooleanField()


# status code Meaning
# 0	Pending
# 1	Accepted
# 2	Declined
# 3	Blocked

class Friend(TimestampModel):
	user_one_id = models.IntegerField()
	user_two_id = models.IntegerField()
	status = models.SmallIntegerField()
	action_user_id = models.IntegerField()

	class Meta:
		unique_together = ("user_one_id", "user_two_id")




