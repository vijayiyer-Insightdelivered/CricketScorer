FROM nginx:alpine
COPY pitchup.html /usr/share/nginx/html/index.html
COPY pitchup.html /usr/share/nginx/html/pitchup.html
COPY sw.js /usr/share/nginx/html/sw.js
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
