require('dotenv').config();

const express = require('express');
const { Client } = require('pg');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');



// Create Express app
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Express configuration
app.use(express.json()); // Replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded()
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express EJS Layouts configuration
app.use(expressLayouts);
app.set('layout', 'layout'); // Ensure this matches your layout file name

app.get('/', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM orders  ORDER BY date DESC, id DESC LIMIT 10');
     // console.log(result.rows); // Log the results to check what is being retrieved
  
      // Render the orders.ejs as a string
      const ordersHtml = await ejs.renderFile(path.join(__dirname, 'views', 'orders.ejs'), { orders: result.rows }, { async: true });
  
      // Pass the rendered HTML to index.ejs
      res.render('index', { 
        title: 'Orders',
        body: ordersHtml 
      });
    } catch (err) {
      console.error('Error fetching orders', err.stack);
      res.status(500).send('Error fetching orders');
    }
  });
  
// Route to fetch and display a specific order
app.get('/order/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Order not found');
      }
  
      res.render('order', {
        title: `Order Details - ${id}`,
        order: result.rows[0]
      });
    } catch (err) {
      console.error('Error fetching order details', err.stack);
      res.status(500).send('Error fetching order details');
    }
  });


// Define other routes as needed...

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
