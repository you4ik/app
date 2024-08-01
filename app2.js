const { Client } = require('pg');
const fs = require('fs');

// Конфигурация подключения к базе данных
const connectionString = 'postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Определение интересующего диапазона дат
const startDate = '2024-07-29';
const endDate = '2024-08-29';

// Подключение к базе данных и выполнение запросов
async function main() {
  await client.connect();

  try {
    // Выполнение запроса с фильтрацией по диапазону дат
    const res = await client.query('SELECT * FROM orders WHERE date::date BETWEEN $1 AND $2', [startDate, endDate]);
    console.log('Data from database for date range:', res.rows); // Проверка данных

    // Проверка, чтобы убедиться, что данные правильно возвращаются
    if (res.rows.length === 0) {
      console.log('No orders found in the specified date range.');
      return;
    }

    const getOrders = {};

    res.rows.forEach(row => {
      const date = row.date.toISOString().split('T')[0]; // Преобразование даты в формат yyyy-mm-dd

      if (!getOrders[date]) {
        getOrders[date] = [];
      }
      getOrders[date].push({
        kol: row.kol,
        sum: row.sum,
        stop: row.stop,
        desc: row.desc
      });
    });

  // Форматирование заказов для вывода с включением дня недели и даты в формате "дд.мм"
function formatOrders(orders) {
    let formatted = "";
    for (const date in orders) {
      if (Array.isArray(orders[date])) {
        // Преобразование строки в объект Date
        const dateObj = new Date(date);
  
        // Получение дня недели и формата даты "дд.мм"
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
  
        // Форматирование строки с днем недели и датой
        formatted += `*** ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} (${formattedDate}) ***\n`;
        
        // Форматирование заказов на конкретную дату
        orders[date].forEach(order => {
          formatted += `- ${order.kol} @ ${order.sum} ${order.desc || ''}\n`;
        });
        formatted += "\n"; // Добавляем пустую строку между датами
      } else {
        console.error(`Orders for ${date} is not an array:`, orders[date]);
      }
    }
    return formatted.trim();
  }
  

    // Вычисление общего количества позиций (AMOUNT)
    function totalItems(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach(order => {
          total += order.kol;
        });
      }
      return total;
    }

    // Вычисление общей суммы (SUMMA) всех транзакций
    function totalSum(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach(order => {
          total += order.sum;
        });
      }
      return total;
    }

    // Вычисление общей суммы стопов (STOP)
    function totalStop(orders) {
      let total = 0;
      for (const date in orders) {
        orders[date].forEach(order => {
          total += order.stop;
        });
      }
      return total;
    }

    // Собираем сообщение
    const message = `

${formatOrders(getOrders)}


***** TOTAL  *****
 - AMOUNT: ${totalItems(getOrders)}           
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
    fs.writeFileSync('message.txt', message);

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main().catch(err => console.error('Error in main function', err));
