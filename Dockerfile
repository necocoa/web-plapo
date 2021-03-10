FROM node:14-slim as build

WORKDIR /app

COPY package.json yarn.lock ./
COPY /server ./server

RUN yarn install --non-interactive --frozen-lockfile

RUN yarn se build


FROM node:14-slim as node_modules

WORKDIR /app

COPY package.json yarn.lock ./
COPY /server ./server

RUN yarn install --non-interactive --frozen-lockfile --prod


FROM gcr.io/distroless/nodejs:14

WORKDIR /app

COPY --from=build /app/server/dist /app/server/dist
COPY --from=node_modules /app/node_modules /app/node_modules
COPY --from=node_modules /app/server/node_modules /app/server/node_modules

ENV NODE_ENV production

CMD ["server/dist/main"]
