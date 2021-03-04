## 仕様技術

- クライアント

  - Next.js
  - vercel

- サーバー API
  - NestJS
  - Cloud Run

## ディレクトリ構成

- `client/`
  - Next.js
- `server/`
  - NestJS

## Set up

```sh
yarn
yarn vercel:env:pull
docker run -d -p 6379:6379 --name web-plapo_redis_local redis
```

## Getting start

```
docker start web-plapo_redis_local
yarn cl:dev
yarn se:dev
```

Client: http://localhost:3000
Server: http://localhost:3001

## デプロイ

プレビュー環境

```sh
yarn cl:deploy:prev
```

本番環境

### クライアント

```sh
yarn cl:deploy:prod
```

### サーバー

```sh
gcloud builds submit --tag gcr.io/web-plapo/api
gcloud run deploy --image gcr.io/web-plapo/api --platform managed
```

## パッケージ管理

Yarn workspace を使って monorepo 運用を行っている
Dev 関係の共通のパッケージ(eslint など)は `-W` を使う

```sh
yarn add -WD eslint
```

ワークスペースに追加する場合は、workspace を指定する
`yarn workspace server`は長いので、`yarn se`の scripts を作ってある

```sh
yarn workspace server add ts-node
yarn se add ts-node
```
