const express = require('express');
const { Client } = require('pg');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');

// Database Configuration
const client = new Client({
  connectionString: 'postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require' 
});
// Connect to Database
(async () => { 
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Database connection error:', err.stack);
    process.exit(1); // Exit on database connection failure
  }
})();

// Express App Setup
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM orders ORDER BY date DESC, id DESC LIMIT 10');
    const ordersHtml = await ejs.renderFile(path.join(__dirname, 'views', 'orders.ejs'), { orders: result.rows }, { async: true });
    res.render('index', { title: 'Orders', body: ordersHtml });
  } catch (err) {
    console.error('Error fetching orders:', err.stack);
    res.status(500).send('Error fetching orders'); // Or render a custom error page
  }
});

app.get('/order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Order not found'); // Or render a 404 page
    }
    res.render('order', { title: `Order Details - ${id}`, order: result.rows[0] });
  } catch (err) {
    console.error('Error fetching order details:', err.stack);
    res.status(500).send('Error fetching order details'); // Or render an error page
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
