const fs = require("fs");
const webpack = require("webpack");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

function buildWebpackConfig(emit) {
  return {
    output: { clean: true },
    mode: "production",
    plugins: [
      new ImageMinimizerPlugin({
        loader: false,
        minimizerOptions: { plugins: ["mozjpeg"] },
      }),
    ],
    module: {
      rules: [{ test: /\.jpeg$/, type: "asset", generator: { emit } }],
    },
  };
}

test("`emit: true` yields the same asset reference as `emit: false`", async () => {
  // run the compiler with {emit: true}
  const emitTrueCompiler = webpack(buildWebpackConfig(true));
  await new Promise((resolve, reject) => {
    emitTrueCompiler.run((err) => (err ? reject(err) : resolve()));
  });
  // the output should contain a reference to `[hash].jpeg`
  const emitTrueOutput = fs.readFileSync(`${__dirname}/dist/main.js`, "utf-8");
  const matches = emitTrueOutput.match(/[A-Za-z0-9]+\.jpeg/g);
  expect(matches).toHaveLength(1);
  const [assetFile] = matches;
  console.log(assetFile);

  // run the compiler with {emit: false}
  const emitFalseCompiler = webpack(buildWebpackConfig(false));
  await new Promise((resolve, reject) => {
    emitFalseCompiler.run((err) => (err ? reject(err) : resolve()));
  });
  // the output should contain the same asset reference as in the previous build
  const emitFalseOutput = fs.readFileSync(`${__dirname}/dist/main.js`, "utf-8");
  expect(emitFalseOutput).toContain(assetFile);
});
