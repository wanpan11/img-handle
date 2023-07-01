/* eslint-disable @typescript-eslint/no-var-requires */

const { globSync } = require("glob");

const imgList = globSync("img/**/*.{png,jpeg,jpg}");

exports.imgList = imgList;
