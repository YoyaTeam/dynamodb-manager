FROM nginx

LABEL maintainer="taydycn@gmail.com"

COPY ./dist /usr/share/nginx/html

COPY nginx_default.conf /etc/nginx/conf.d/default.conf