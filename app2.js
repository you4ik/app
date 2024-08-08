const { Client } = require("pg");
const fs = require("fs");

// Конфигурация подключения к базе данных
const connectionString =
  "postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require";

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Определение интересующего диапазона дат
const startDate = "2024-08-06"; // Формат yyyy-mm-dd
const endDate = "2024-08-09"; // Формат yyyy-mm-dd

async function main() {
  await client.connect();

  try {
    // Выполнение запроса с фильтрацией по диапазону дат
    // Преобразуем текстовое поле в формат DATE для сравнения
    const query = `
      SELECT * FROM orders 
      WHERE date BETWEEN $1 AND $2 order by date asc, id asc
    `;
    const res = await client.query(query, [startDate, endDate]);
    console.log("Data from database for date range:", res.rows); // Проверка данных

    // Проверка, чтобы убедиться, что данные правильно возвращаются
    if (res.rows.length === 0) {
      console.log("No orders found in the specified date range.");
      return;
    }

    const getOrders = {};

    res.rows.forEach((row) => {
      const date = row.date; // Оставляем дату в формате dd.mm.yyyy

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

    // Function to format a Date object to "Day of the week, dd.mm"
    function formatDate(date) {
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "long", // Full name of the day
        day: "2-digit", // Two-digit day
        month: "2-digit", // Two-digit month
      }).format(date);
    }

    // Formatting orders for output
    function formatOrders(orders) {
      let formatted = "";
      for (const date in orders) {
        if (Array.isArray(orders[date])) {
          // Parse the date string into a Date object
          const parsedDate = new Date(date);

          // Format the date
          const formattedDate = formatDate(parsedDate);

          // Add the formatted date to the output
          formatted += `*** ${formattedDate} ***\n`;

          // Iterate over each order for the current date
          orders[date].forEach((order) => {
            formatted += `- ${order.kol} @ ${order.sum} ${order.desc || ""}\n`;
          });

          // Add a newline between different dates
          formatted += "\n";
        } else {
          console.error(`Orders for ${date} is not an array:`, orders[date]);
        }
      }
      return formatted.trim(); // Remove the trailing newline
    }

    // Вычисление общего количества позиций (AMOUNT)
    function totalItems(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach((order) => {
          total += order.kol;
        });
      }
      return total;
    }

    // Вычисление общей суммы (SUMMA) всех транзакций
    function totalSum(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach((order) => {
          total += order.sum;
        });
      }
      return total;
    }

    // Вычисление общей суммы стопов (STOP)
    function totalStop(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach((order) => {
          total += order.stop;
        });
      }
      return total;
    }

    // Собираем сообщение
    const message = `

${formatOrders(getOrders)}


***** TOTAL  *****
 - AMOUNT: ${totalItems(getOrders) + 2}           
 - SUMMA: ${totalSum(getOrders)},       
 - STOP: ${totalStop(getOrders)},         
*****************

**** BALANCE ****
 - SEK: ${totalSum(getOrders) - totalStop(getOrders)}          
 - USDT: 80            
 - EUR: 0              
*****************
`;

    // Выводим сообщение
    console.log(message);
    // Записываем сообщение в файл message.txt
    fs.writeFileSync("message.txt", message);
  } catch (err) {
    console.error("Error executing query", err.stack);
  } finally {
    await client.end();
  }
}

main().catch((err) => console.error("Error in main function", err));
