## パッケージ管理

Yarn workspace を使って monorepo 運用を行っている
Dev 関係の共通のパッケージ(eslint など)は `-W` を使う

```sh
yarn add -WD eslint
```

ワークスペースに追加する場合は、workspace を指定する
`yarn workspace backend`は長いので、`yarn b`の scripts を作ってある

```sh
yarn workspace backend add ts-node
yarn b add ts-node
```
