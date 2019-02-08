# messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from . import models


class MessageSerializer(serializers.ModelSerializer):
	id = serializers.CharField(source='hash_id', read_only=True)
	sender_id = serializers.CharField(source='sender.hash_id', read_only=True)
	sender = serializers.CharField(source='sender.username', read_only=True)
	thread_id = serializers.CharField(source='thread.hash_id', read_only=True)

	class Meta:
		model = models.Message
		fields = ('id','date','text','sender_id','sender','thread_id')


class MessageListSerializer(serializers.ListSerializer):
	child = MessageSerializer()
	many = True
	allow_null = True



class MessageThreadSerializer(serializers.ModelSerializer):
	id = serializers.CharField(source='hash_id',read_only=True)
	unread_count = serializers.IntegerField(read_only=True)
	last_message = MessageSerializer(read_only=True,many=False)
	title = serializers.CharField(default="lol",read_only=True)



	class Meta:
		model = models.MessageThread
		fields = ('id', 'title','last_message','unread_count')

	# def to_representation(self, data):
	# 	data = super(MessageThreadSerializer, self).to_representation(data)
	# 	if data.id:
	# 		clients = models.MessageThread.clients.objects.all()
	# 		if clients:
	# 			data['clients'] = clients
	# 	return data


class MessageThreadListSerializer(serializers.ListSerializer):
	child = MessageThreadSerializer()
	many = True
	allow_null = True
