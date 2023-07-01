export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 10%, not dead",
        useBuiltIns: "usage",
        corejs: "3.30.2",
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
