module.exports = {
    proxy: "localhost:3000",
    files: ["public/**/*.*", "views/**/*.*"],
    port: 3001,
    ui: true,
    notify: false,
  };
  // Пример инициализации uiOpts как Immutable.Map
var Immutable = require("immutable");
var uiOpts = Immutable.fromJS({
    enabled: true
});
