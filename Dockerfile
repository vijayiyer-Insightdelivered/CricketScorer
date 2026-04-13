FROM nginx:alpine
COPY pitchup.html /usr/share/nginx/html/index.html
COPY pitchup.html /usr/share/nginx/html/pitchup.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
