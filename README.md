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
