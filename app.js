const { Pool } = require('pg');

// Настройки подключения к базе данных PostgreSQL
const pool = new Pool({
    user: 'default',
    host: 'ep-spring-dream-58410209.eu-central-1.aws.neon.tech',
    database: 'verceldb',
    password: 'w9UuYScFEy3M',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Пример функции для получения всех заказов
async function getOrders() {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY order_date');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
}

// Пример функции для добавления нового заказа
async function addOrder(order) {
    const { order_date, kol, sum, stop, desc } = order;
    try {
        await pool.query(
            'INSERT INTO orders (order_date, kol, sum, stop, "desc") VALUES ($1, $2, $3, $4, $5)',
            [order_date, kol, sum, stop, desc]
        );
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
}

// Пример использования
(async () => {
    try {
        // Получение всех заказов
        const orders = await getOrders();
        console.log('Orders:', orders);

        // Добавление нового заказа
        await addOrder({
            order_date: '2024-07-26',
            kol: 5,
            sum: 2000,
            stop: 300,
            desc: 'New order'
        });

        console.log('Order added successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Закрываем соединение с базой данных
        await pool.end();
    }
})();
