"use strict";

var express = require("express");

var _require = require("pg"),
    Client = _require.Client;

var path = require("path");

var expressLayouts = require("express-ejs-layouts");

var ejs = require("ejs"); // Database Configuration


var client = new Client({
  connectionString: "postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
}); // Connect to Database

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          console.log("Connected to PostgreSQL");
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error("Database connection error:", _context.t0.stack);
          process.exit(1); // Exit on database connection failure

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
})();

var app = express(); // Middleware

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"](path.join(__dirname, "public"))); // View Engine Setup

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Убедитесь, что папка для шаблонов называется "views"

app.use(expressLayouts);
app.set("layout", "index"); // Default layout
// Repeat for other routes
// Routes

app.get("/", function _callee2(req, res) {
  var result, ordersHtml;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(client.query("SELECT * FROM orders ORDER BY date DESC, id DESC LIMIT 10"));

        case 3:
          result = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(ejs.renderFile(path.join(__dirname, "views", "orders.ejs"), {
            orders: result.rows
          }, {
            async: true
          }));

        case 6:
          ordersHtml = _context2.sent;
          res.render("index", {
            title: "Orders",
            body: ordersHtml
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching orders:", _context2.t0.stack);
          res.status(500).send("Error fetching orders"); // Или отобразите страницу с ошибкой

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
app.get("/order/:id", function _callee3(req, res) {
  var id, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(client.query("SELECT * FROM orders WHERE id = $1", [id]));

        case 4:
          result = _context3.sent;

          if (!(result.rows.length === 0)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).send("Order not found"));

        case 7:
          res.render("order", {
            title: "Order Details - ".concat(id),
            order: result.rows[0]
          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.error("Error fetching order details:", _context3.t0.stack);
          res.status(500).send("Error fetching order details"); // Или отобразите страницу с ошибкой

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
var PORT = process.env.PORT || 3000; // Start Server

app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});