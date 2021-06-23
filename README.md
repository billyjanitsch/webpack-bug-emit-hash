# Webpack asset hash emit bug

This repository provides a repro for the following webpack bug. When `module.rule.generator.emit` is set to `false` for asset resources, webpack is supposed to emit the same filename as when it's set to `true`. This doesn't work correctly if there's an image minimizer in the chain, presumably because the minifier is only running when `{emit: true}` and ends up influencing the asset hash.

Note that this reproduces regardless of the asset filename, e.g., setting it to something like `[contenthash][ext]` does not fix the issue.

## Instructions

A failing test case can be run as follows:

```
$ npm install
$ npm test
```

See the [test file](./test.js) for details.
