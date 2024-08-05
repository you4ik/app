"use strict";

var _require = require('child_process'),
    exec = _require.exec;

var path = require('path');

var config = {
  user: 'default',
  host: 'ep-spring-dream-58410209.eu-central-1.aws.neon.tech',
  database: 'verceldb',
  password: 'w9UuYScFEy3M',
  port: 5432,
  options: 'endpoint=ep-spring-dream-58410209'
};
var dumpFile = path.join(__dirname, 'backup', "backup_".concat(new Date().toISOString().replace(/[:.]/g, '_'), ".sql"));
var command = "PGPASSWORD=\"".concat(config.password, "\" pg_dump --host=").concat(config.host, " --port=").concat(config.port, " --username=").concat(config.user, " --dbname=").concat(config.database, " --format=plain --no-owner --clean --no-privileges --no-comments --file=").concat(dumpFile, " --verbose --no-password --options=\"").concat(config.options, "\"");
exec(command, function (error, stdout, stderr) {
  if (error) {
    console.error("Error: ".concat(error.message));
    return;
  }

  if (stderr) {
    console.error("Stderr: ".concat(stderr));
    return;
  }

  console.log("Stdout: ".concat(stdout));
});