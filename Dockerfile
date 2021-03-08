FROM node:12-slim as build

WORKDIR /app

COPY package.json yarn.lock ./
COPY /server ./server

RUN yarn install --non-interactive --frozen-lockfile

RUN yarn se build


FROM node:12-slim as node_modules

WORKDIR /app

COPY package.json yarn.lock ./
COPY /server ./server

RUN yarn install --non-interactive --frozen-lockfile --prod


FROM gcr.io/distroless/nodejs:12

WORKDIR /app

COPY --from=build /app/server/dist /app/server/dist
COPY --from=node_modules /app/node_modules /app/node_modules
COPY --from=node_modules /app/server/node_modules /app/server/node_modules

ENV NODE_ENV production

CMD ["server/dist/main"]
