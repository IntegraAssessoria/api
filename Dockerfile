FROM node:20.15.0

WORKDIR /home

COPY ./ ./

RUN yarn install
RUN yarn build
EXPOSE 5000

CMD ["yarn", "run", "start:prod"]
