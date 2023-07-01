/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const baseConfig = require("./webpack.config.base.cjs");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (_, argv) => {
  console.log("MODE ===>", argv.mode);

  if (argv.mode === "development") {
    baseConfig.plugins.push(new webpack.SourceMapDevToolPlugin({}));
  }

  if (argv.mode === "production") {
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({ analyzerMode: "static" })
    );
  }

  return baseConfig;
};
