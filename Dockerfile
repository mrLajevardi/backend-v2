FROM node:18-alpine

WORKDIR /user/src/app

COPY . .
# We have to optimise above line  becuase now , that copy all files into the docker system

RUN npm install  # We have to ignore all packages that is necessary for dev environment

RUN npm run build

# RUN /usr/bin/crontab /crontab.txt
RUN echo '0 * * * * node /user/src/app/scripts/check-payg-services.js' >> /etc/crontabs/root
RUN echo '0 */12 * * * node /user/src/app/scripts/check-services.js' >> /etc/crontabs/root
#USER node

# CMD ["npm", "run", "start:prod", "/usr/sbin/crond", "-l", "2"]
CMD [ "sh", "-c", "npm run start:prod & /usr/sbin/crond -f -l 2 > /dev/stdout"]
# CMD ["/user/src/app/deploy-test.sh"]
# CMD [ "/usr/bin/crontab", "./crontab.txt" ]