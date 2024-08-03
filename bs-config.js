// bs-config.js

const browserSync = require('browser-sync').create();

browserSync.init({
  proxy: 'http://localhost:3000', // Your local server URL
  files: ['public/**/*.*', 'views/**/*.*'], // Files to watch for changes
  port: 3001, // Port to serve the browser-sync server on
  open: false, // Do not open browser automatically
});
