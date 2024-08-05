"use strict";

module.exports = {
  watch: ["app.js", "views/**/*.ejs", "public/**/*.*"],
  ext: "js,ejs,css,html",
  ignore: ["public/**/*.js"],
  exec: "node app.js",
  restartable: "rs",
  verbose: true
};