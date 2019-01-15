#Install python3 on Amazon Linux
https://docs.aws.amazon.com/cli/latest/userguide/install-linux-python.html
sudo yum install python3 python3-devel gcc

#run django
python manage.py runserver 0.0.0.0:8000

#Install node on Amazon Linux
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 9

#run angular
npm start

#install nginx on amazon linux 2
sudo amazon-linux-extras install nginx1.12
sudo systemctl enable nginx
sudo service nginx status

#install uwsgi 
pip3 install uwsgi

#guide for uwsgi and nginx
https://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html
 
#djanog uwsgi file 
## /home/ec2-user/project/backend/django.ini
[uwsgi]
    chdir=/home/ec2-user/project/backend
    module=django_project.wsgi:application
    master=True
    home=/home/ec2-user/venv/python36
    pidfile=/tmp/django-master.pid
    socket=127.0.0.1:8001
    processes=5
    limit-post=78643200
    harakiri=600
    max-requests=5000
    #limit-as=256
    vacuum=True
   
#site nginx configure file
## backend_nginx.conf
upstream django {
   
    server 127.0.0.1:8001; # for a web port socket (we'll use this first)
}

server {
        # the port your site will be served on
    listen      8000;
        # the domain name it will serve for
        # substitute your machine's IP address or FQDN
    server_name 0.0.0.0;
    charset     utf-8;

        # max upload size
    client_max_body_size 75M;   # adjust to taste

        # Django media
    location /media  {
            # your Django project's media files - amend as required
        alias /home/ec2-user/project/backend/media;
    }

    location /static {
            # your Django project's static files - amend as required
        alias /home/ec2-user/project/backend/static;
    }

        # Finally, send all non-media requests to the Django server.
    location / {
            #root /etc/ec2-user/git/redshift_loader/backend/static/index.html;
            #proxy_pass http://127.0.0.1:8000;
        uwsgi_read_timeout 600;
        uwsgi_pass  django;
        include     /etc/nginx/uwsgi_params;
    }
}
#Symlink to this file from /etc/nginx/sites-enabled so nginx can see it:
sudo mkdir /etc/nginx/sites-enabled
sudo ln -s backend_nginx.conf /etc/nginx/sites-enabled/





