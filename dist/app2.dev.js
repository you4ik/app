"use strict";

var _require = require("pg"),
  Client = _require.Client;

var fs = require("fs"); // Конфигурация подключения к базе данных

var connectionString =
  "postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require";
var client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
}); // Определение интересующего диапазона дат

var startDate = "2024-07-29"; // Формат yyyy-mm-dd

var endDate = "2024-08-05"; // Формат yyyy-mm-dd

function main() {
  var formatDate,
    formatOrders,
    totalItems,
    totalSum,
    totalStop,
    query,
    res,
    getOrders,
    message;
  return regeneratorRuntime.async(
    function main$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(client.connect());

          case 2:
            _context.prev = 2;

            // Function to format a Date object to "Day of the week, dd.mm"
            formatDate = function formatDate(date) {
              return new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                // Full name of the day
                day: "2-digit",
                // Two-digit day
                month: "2-digit", // Two-digit month
              }).format(date);
            }; // Formatting orders for output

            formatOrders = function formatOrders(orders) {
              var formatted = "";

              for (var date in orders) {
                if (Array.isArray(orders[date])) {
                  // Parse the date string into a Date object
                  var parsedDate = new Date(date); // Format the date

                  var formattedDate = formatDate(parsedDate); // Add the formatted date to the output

                  formatted += "*** ".concat(formattedDate, " ***\n"); // Iterate over each order for the current date

                  orders[date].forEach(function (order) {
                    formatted += "- "
                      .concat(order.kol, " @ ")
                      .concat(order.sum, " ")
                      .concat(order.desc || "", "\n");
                  }); // Add a newline between different dates

                  formatted += "\n";
                } else {
                  console.error(
                    "Orders for ".concat(date, " is not an array:"),
                    orders[date],
                  );
                }
              }

              return formatted.trim(); // Remove the trailing newline
            }; // Вычисление общего количества позиций (AMOUNT)

            totalItems = function totalItems(orders) {
              var total = 0;

              for (var date in orders) {
                orders[date].forEach(function (order) {
                  total += order.kol;
                });
              }

              return total;
            }; // Вычисление общей суммы (SUMMA) всех транзакций

            totalSum = function totalSum(orders) {
              var total = 0;

              for (var date in orders) {
                orders[date].forEach(function (order) {
                  total += order.sum;
                });
              }

              return total;
            }; // Вычисление общей суммы стопов (STOP)

            totalStop = function totalStop(orders) {
              var total = 0;

              for (var date in orders) {
                orders[date].forEach(function (order) {
                  total += order.stop;
                });
              }

              return total;
            }; // Собираем сообщение

            // Выполнение запроса с фильтрацией по диапазону дат
            // Преобразуем текстовое поле в формат DATE для сравнения
            query =
              "\n      SELECT * FROM orders \n      WHERE date BETWEEN $1 AND $2 order by date asc, id asc\n    ";
            _context.next = 11;
            return regeneratorRuntime.awrap(
              client.query(query, [startDate, endDate]),
            );

          case 11:
            res = _context.sent;
            console.log("Data from database for date range:", res.rows); // Проверка данных
            // Проверка, чтобы убедиться, что данные правильно возвращаются

            if (!(res.rows.length === 0)) {
              _context.next = 16;
              break;
            }

            console.log("No orders found in the specified date range.");
            return _context.abrupt("return");

          case 16:
            getOrders = {};
            res.rows.forEach(function (row) {
              var date = row.date; // Оставляем дату в формате dd.mm.yyyy

              if (!getOrders[date]) {
                getOrders[date] = [];
              }

              getOrders[date].push({
                kol: row.kol,
                sum: row.sum,
                stop: row.stop,
                desc: row.desc,
              });
            });
            message = "\n\n"
              .concat(
                formatOrders(getOrders),
                "\n\n\n***** TOTAL  *****\n - AMOUNT: ",
              )
              .concat(totalItems(getOrders) + 2, "           \n - SUMMA: ")
              .concat(totalSum(getOrders), ",       \n - STOP: ")
              .concat(
                totalStop(getOrders),
                ",         \n*****************\n\n**** BALANCE ****\n - SEK: ",
              )
              .concat(
                totalSum(getOrders) - totalStop(getOrders),
                "          \n - USDT: 80            \n - EUR: 0              \n*****************\n",
              ); // Выводим сообщение

            console.log(message); // Записываем сообщение в файл message.txt

            fs.writeFileSync("message.txt", message);
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](2);
            console.error("Error executing query", _context.t0.stack);

          case 26:
            _context.prev = 26;
            _context.next = 29;
            return regeneratorRuntime.awrap(client.end());

          case 29:
            return _context.finish(26);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[2, 23, 26, 30]],
  );
}

main()["catch"](function (err) {
  return console.error("Error in main function", err);
});
