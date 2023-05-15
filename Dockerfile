FROM nginx:latest

COPY --chmod=644 default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx build /usr/share/nginx/app/
