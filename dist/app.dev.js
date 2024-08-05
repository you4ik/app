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
          return regeneratorRuntime.awrap(client.query("SELECT id, sum, date FROM orders ORDER BY date DESC, id DESC LIMIT 10"));

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
          return regeneratorRuntime.awrap(client.query("\n      SELECT o.*, \n             v.name AS vendor_name,\n             json_agg(json_build_object('type', i.item_type, 'quantity', i.quantity, 'price', i.price, 'currency', i.currency)) as item_details\n      FROM orders o\n      LEFT JOIN LATERAL jsonb_array_elements_text(o.items) AS item_id ON true\n      LEFT JOIN items i ON i.id = item_id::int\n      LEFT JOIN vendor v ON v.id = o.vendor_id\n      WHERE o.id = $1\n      GROUP BY o.id, v.name\n  ", [id]));

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
          res.status(500).send("Error fetching order details");

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
app.get('/stats', function _callee4(req, res) {
  var _req$query, start_date, end_date, item_type, whereClause, queryParams, result;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query = req.query, start_date = _req$query.start_date, end_date = _req$query.end_date, item_type = _req$query.item_type;
          whereClause = '';
          queryParams = [];

          if (start_date) {
            whereClause += ' AND o.date >= $' + (queryParams.length + 1);
            queryParams.push(start_date);
          }

          if (end_date) {
            whereClause += ' AND o.date <= $' + (queryParams.length + 1);
            queryParams.push(end_date);
          }

          if (item_type) {
            whereClause += ' AND i.item_type = $' + (queryParams.length + 1);
            queryParams.push(item_type);
          }

          _context4.prev = 6;
          _context4.next = 9;
          return regeneratorRuntime.awrap(client.query("\n      WITH order_items AS (\n        SELECT \n          o.id,\n          i.item_type,\n          i.quantity,\n          i.price,\n          i.currency\n        FROM orders o\n        JOIN LATERAL jsonb_array_elements_text(o.items) AS item_id ON true\n        JOIN items i ON i.id = item_id::int\n        WHERE 1=1 ".concat(whereClause, "\n      )\n      SELECT \n        COUNT(DISTINCT order_items.id) as order_count,\n        SUM(CASE WHEN order_items.item_type = 'MIN' THEN order_items.quantity ELSE 0 END) as min_sold,\n        jsonb_object_agg(currency_totals.currency, currency_totals.total_sum) as total_sums\n      FROM (\n        SELECT \n          currency, \n          SUM(price * quantity) as total_sum\n        FROM order_items\n        GROUP BY currency\n      ) currency_totals\n      CROSS JOIN order_items\n      GROUP BY currency_totals.currency\n    "), queryParams));

        case 9:
          result = _context4.sent;
          console.log('Stats retrieved successfully:');
          console.log('Order count:', result.rows[0].order_count);
          console.log('MIN sold:', result.rows[0].min_sold);
          console.log('Total sums:', result.rows[0].total_sums);
          res.render('stats', {
            title: 'Order Statistics',
            stats: result.rows[0],
            filters: {
              start_date: start_date,
              end_date: end_date,
              item_type: item_type
            }
          });
          _context4.next = 21;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](6);
          console.error('Error fetching stats:', _context4.t0.stack);
          res.status(500).send('Error fetching stats');

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 17]]);
});
app.post('/create-order', function _callee5(req, res) {
  var _req$body, items, customer_info, client, itemIds, totalSums, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _ref2, _rows, _ref, rows;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, items = _req$body.items, customer_info = _req$body.customer_info;
          _context5.next = 3;
          return regeneratorRuntime.awrap(pool.connect());

        case 3:
          client = _context5.sent;
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(client.query('BEGIN'));

        case 7:
          itemIds = [];
          totalSums = {};
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 12;
          _iterator = items[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 26;
            break;
          }

          item = _step.value;
          _context5.next = 18;
          return regeneratorRuntime.awrap(client.query('INSERT INTO items (item_type, quantity, price, currency) VALUES ($1, $2, $3, $4) RETURNING id', [item.type, item.quantity, item.price, item.currency]));

        case 18:
          _ref2 = _context5.sent;
          _rows = _ref2.rows;
          itemIds.push(_rows[0].id);

          if (!totalSums[item.currency]) {
            totalSums[item.currency] = 0;
          }

          totalSums[item.currency] += item.price * item.quantity;

        case 23:
          _iteratorNormalCompletion = true;
          _context5.next = 14;
          break;

        case 26:
          _context5.next = 32;
          break;

        case 28:
          _context5.prev = 28;
          _context5.t0 = _context5["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 32:
          _context5.prev = 32;
          _context5.prev = 33;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 35:
          _context5.prev = 35;

          if (!_didIteratorError) {
            _context5.next = 38;
            break;
          }

          throw _iteratorError;

        case 38:
          return _context5.finish(35);

        case 39:
          return _context5.finish(32);

        case 40:
          _context5.next = 42;
          return regeneratorRuntime.awrap(client.query('INSERT INTO orders (items, total_sums, customer_info) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(itemIds), JSON.stringify(totalSums), JSON.stringify(customer_info)]));

        case 42:
          _ref = _context5.sent;
          rows = _ref.rows;
          _context5.next = 46;
          return regeneratorRuntime.awrap(client.query('COMMIT'));

        case 46:
          res.json({
            orderId: rows[0].id
          });
          _context5.next = 54;
          break;

        case 49:
          _context5.prev = 49;
          _context5.t1 = _context5["catch"](4);
          _context5.next = 53;
          return regeneratorRuntime.awrap(client.query('ROLLBACK'));

        case 53:
          throw _context5.t1;

        case 54:
          _context5.prev = 54;
          client.release();
          return _context5.finish(54);

        case 57:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 49, 54, 57], [12, 28, 32, 40], [33,, 35, 39]]);
});
app.get('/purchases', function _callee6(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(client.query("\n          SELECT p.*, v.name AS vendor_name\n          FROM purchases p\n          JOIN vendor v ON v.id = p.vendor_id\n          ORDER BY p.date DESC LIMIT 10\n      "));

        case 3:
          result = _context6.sent;
          res.render('purchases', {
            purchases: result.rows
          });
          _context6.next = 11;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching purchases:', _context6.t0.stack);
          res.status(500).send('Error fetching purchases');

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.post('/purchases', function _callee7(req, res) {
  var _req$body2, vendor_id, items, driver, delivery_cost, total_cost;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, vendor_id = _req$body2.vendor_id, items = _req$body2.items, driver = _req$body2.driver, delivery_cost = _req$body2.delivery_cost;
          total_cost = {};
          items.forEach(function (item) {
            if (!total_cost[item.currency]) {
              total_cost[item.currency] = 0;
            }

            total_cost[item.currency] += item.price * item.quantity;
          });
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(client.query("\n          INSERT INTO purchases (vendor_id, items, total_cost, driver, delivery_cost)\n          VALUES ($1, $2, $3, $4, $5)\n      ", [vendor_id, JSON.stringify(items), JSON.stringify(total_cost), driver, delivery_cost]));

        case 6:
          res.redirect('/purchases');
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](3);
          console.error('Error creating purchase:', _context7.t0.stack);
          res.status(500).send('Error creating purchase');

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
app.get('/add-purchase', function _callee8(req, res) {
  var vendorResult, driverResult;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(client.query('SELECT id, name FROM vendor ORDER BY name'));

        case 3:
          vendorResult = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(client.query('SELECT id, name FROM driver ORDER BY name'));

        case 6:
          driverResult = _context8.sent;
          res.render('add-purchase', {
            vendors: vendorResult.rows,
            drivers: driverResult.rows,
            header: 0
          });
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching data:', _context8.t0.stack);
          res.status(500).send('Error fetching data');

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
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