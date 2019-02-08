# messaging/views.py

from rest_framework import status, generics , mixins
from rest_framework.response import Response

from django.http import JsonResponse, HttpResponse
from django.db.models import Count, Q
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from . import models
from . import serializers


class LoadInbox(generics.GenericAPIView):
	def post(self, request, *args, **kw):
		user = request.user
		if not user.is_active:
			return Response({'error': 'You are not activated.'}, status=status.HTTP_401_UNAUTHORIZED)
		threads = models.MessageThread.objects.filter(clients=request.user).annotate(
			unread_count=Count('receipts', filter=Q(receipts__recipient=request.user))
		)
		rooms=[]
		for t in threads.values():
			if t['id']:
				ths = models.MessageThread.objects.get(id=t['id'])
				clients = ths.clients.all()
				for c in clients:
					if c != user:
						image = c.profile_set.values_list('image', flat=True)[0]
						client_name = c.username
						t['image'] = image
						t['client_name'] = client_name
						rooms.append(t)

				pass
		import json
		thread_data = json.dumps(rooms)
		# thread_data = serializers.MessageThreadListSerializer(threads).data
		return Response({'threads': thread_data})


class LoadMessages(generics.GenericAPIView):
	"""Load messages from thread

	 - Load 30 messages by default.
	 - The 'before' parameter will load the previous 30 messages relative to the date.
	 - returns json {messages:[message], end:bool}
	"""
	def post(self, request, *args, **kw):
		user = request.user
		if not user.is_active:
			return Response({'error': 'You are not activated.'}, status=status.HTTP_401_UNAUTHORIZED)

		thread = models.MessageThread.objects.get(hash_id=request.data['id'])
		# make sure we are part of this chat before we read the messages
		if not request.user in thread.clients.all():
			return HttpResponse(status=403)
		# query for messages filter
		q = [Q(thread=thread)]
		if 'before' in request.GET:
			q.append(Q(date__lt=int(request.GET['before'])))
		# query messages matching filter
		messages = models.Message.objects.filter(*q).order_by('-id')
		messages_data = serializers.MessageListSerializer(messages[:30]).data
		# mark any unread messages in chat as read
		thread.mark_read(request.user)
		return JsonResponse({"id":thread.id, "hash_id":thread.hash_id, "messages": messages_data,"end": messages.count() <= 30})


class AddChatRoom(generics.GenericAPIView):
	"""Add user to chatroom

	 - create thread if existing one with title does not exist
	 - user is added to the chat as well as the channel_layer group using the channel_name
	   specified in the session.
	"""
	def post(self, request, *args, **kw):
		user = request.user
		if not user.is_active:
			return Response({'error': 'You are not activated.'}, status=status.HTTP_401_UNAUTHORIZED)
		title = request.data['title'].strip()
		client_name = request.data['client_name'].strip()
		client = User.objects.get(username=client_name)
		if not client:
			return Response({'error': 'The client does not exist.'}, status=status.HTTP_401_UNAUTHORIZED)
		# get or create thread
		if models.MessageThread.objects.filter(title=title).exists():
			thread = models.MessageThread.objects.get(title=title)
		else:
			thread = models.MessageThread(title=title)
			thread.save()
		# add user to client if not added already

		if not client in thread.clients.all():
			thread.clients.add(client)
		if not request.user in thread.clients.all():
			thread.clients.add(request.user)
			# channel_layer = get_channel_layer()
			# if 'channel_name' in request.session:
			# 	# add user's channel layer to thread group
			# 	async_to_sync(channel_layer.group_add)(thread.hash_id, request.session['channel_name'])
		return HttpResponse(status=200)

