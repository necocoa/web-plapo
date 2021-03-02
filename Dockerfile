FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY /server ./server

RUN yarn install --pure-lockfile --non-interactive

RUN yarn se build


FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY --from=build /usr/src/app/server/package.json /usr/src/app/server/package.json
COPY --from=build /usr/src/app/server/dist /usr/src/app/server/dist

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --prod

CMD ["node", "server/dist/main"]
