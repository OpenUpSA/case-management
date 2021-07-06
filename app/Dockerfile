FROM node

RUN apt-get update
RUN apt-get install yarn -y

WORKDIR /app/app

#RUN yarn
#RUN yarn install typescript -g

EXPOSE 3000
CMD ["yarn", "start"]
