"use strict";

module.exports = {
  // ... другие настройки
  devServer: {
    "static": {
      directory: './public'
    },
    hot: true,
    proxy: {
      '/': 'http://localhost:3000'
    }
  }
};