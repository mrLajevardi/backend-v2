
FROM node:18-alpine

WORKDIR /user/src/app

COPY . .
# We have to optimise above line  becuase now , that copy all files into the docker system

RUN npm install  # We have to ignore all packages that is necessary for dev environment

RUN npm run build

#USER node

CMD ["npm", "run", "start:prod"]