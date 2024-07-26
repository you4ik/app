const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// Создаем экземпляр приложения Express
const app = express();
const port = 3000;

// Настройка подключения к базе данных
const client = new Client({
    connectionString: 'postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require'
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Настройка Express
app.use(bodyParser.json());
app.use(express.static('public'));

// Получение заказов
app.get('/orders', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders', err.stack);
        res.status(500).send('Error fetching orders');
    }
});

// Добавление нового заказа
app.post('/orders', async (req, res) => {
    const { date, kol, sum, stop, desc } = req.body;
    try {
        await client.query(
            'INSERT INTO orders (date, kol, sum, stop, desc) VALUES ($1, $2, $3, $4, $5)',
            [date, kol, sum, stop, desc]
        );
        res.send('Order added successfully');
    } catch (err) {
        console.error('Error adding order', err.stack);
        res.status(500).send('Error adding order');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
