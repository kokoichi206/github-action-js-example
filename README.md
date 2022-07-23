# github-action-js-example

JavaScript action example

## How to setup

[公式のページ](https://docs.github.com/ja/actions/creating-actions/creating-a-javascript-action)がちゃんと詳しい。

### typescript

1. Create project

```sh
$ npm init
# Basically, choose default
# version -> 0.0.0
# entry point -> dist/index.js

$ npm i -D typescript @types/node
```

2. Prepare `tsconfig.json`, `tsconfig.build.json`
3. package.json を編集

```sh
$ cat package.json
...
  "scripts": {
    "build": "tsc -p tsconfig.build.json"
  },
```
