from rest_framework import serializers, mixins
from .models import AuthToken, Profile, Review, Friend
from django.contrib.auth.models import User, Group


class UserSerializer(serializers.ModelSerializer):

	'''
	Serializer for User.
	'''
	class Meta:
		'''
		Serializer customization
		'''
		model = User
		fields = ('email', 'username', 'password', 'first_name', 'last_name')
		extra_kwargs = {
			'password': {
				'write_only': True,
			},
		}

	# def create(self, validated_data):
	#     '''
	#     create new user
	#     '''
	#     # return User.objects.create_user(**validated_data)
	#     user = User(
	#         # email=validated_data['email'],
	#         username=validated_data['username']
	#     )
	#     user.set_password(validated_data['password'])
	#     user.save()
	#     return user

	# def update(self, instance, validated_data):
	#     instance.email = validated_data.get('email', instance.email)
	#     instance.content = validated_data.get('content', instance.content)
	#     instance.created = validated_data.get('created', instance.created)
	#     instance.save()
	#     return instance


class GroupSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Group
		fields = ('url', 'name')


class UserLoginSerializer(serializers.ModelSerializer):

	'''
	Serializer for User.
	'''
	class Meta:
		'''
		Serializer customization
		'''
		model = AuthToken
		fields = ('token', 'user')

	def to_representation(self, data):
		data = super(UserLoginSerializer, self).to_representation(data)
		if data['user']:
			user = User.objects.filter(id=data['user']).first()
			if user:
				data['user'] = UserSerializer(user).data
		return data


class UserLogoutSerializer(serializers.Serializer):
	token = serializers.UUIDField()


class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile
		fields = ('image', 'friend', 'gender','location','user')

	def to_representation(self, data):
		data = super(ProfileSerializer, self).to_representation(data)
		if data['user']:
			user = User.objects.filter(id=data['user']).first()
			if user:
				data.update(UserSerializer(user).data)
		return data


class ReviewSerializer(serializers.ModelSerializer):
	class Meta:
		model = Review
		fields = '__all__'

	def to_representation(self, instance):
		data = super(ReviewSerializer, self).to_representation(instance)
		if data['sender']:
			user = User.objects.filter(username=data['sender']).first()
			if user:
				profile = Profile.objects.get(user=user)
				if profile:
					data['image'] = profile.image
		return data


class FriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friend
		fields = ('user_one_id', 'user_two_id', 'status', 'action_user_id')

	def to_representation(self, instance):
		data = super(FriendSerializer, self).to_representation(instance)
		if data['user_two_id'] and int(data['status'])==1:
			user = User.objects.filter(id=data['user_two_id']).first()
			if user:
				data['user_two_id'] = UserSerializer(user).data
			profile = Profile.objects.get(user=user)
			if profile:
				data['image'] = profile.image
		return data