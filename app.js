const express = require("express");
const { Client } = require("pg");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");

// Database Configuration
const client = new Client({
  connectionString:
    "postgres://default:w9UuYScFEy3M@ep-spring-dream-58410209.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

// Connect to Database
(async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Database connection error:", err.stack);
    process.exit(1); // Exit on database connection failure
  }
})();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Убедитесь, что папка для шаблонов называется "views"
app.use(expressLayouts);
app.set("layout", "index"); // Default layout

// Repeat for other routes
// Routes
app.get("/", async (req, res) => {
  try {
  // Fetching orders
  const result = await client.query(
    "SELECT id, sum, date FROM orders ORDER BY date DESC, id DESC LIMIT 10"
  );
  
    const ordersHtml = await ejs.renderFile(
      path.join(__dirname, "views", "orders.ejs"),
      { orders: result.rows },
      { async: true },
    );
    res.render("index", { title: "Orders", body: ordersHtml });
  } catch (err) {
    console.error("Error fetching orders:", err.stack);
    res.status(500).send("Error fetching orders"); // Или отобразите страницу с ошибкой
  }
});
app.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(`
      SELECT o.*, 
             v.name AS vendor_name,
             json_agg(json_build_object('type', i.item_type, 'quantity', i.quantity, 'price', i.price, 'currency', i.currency)) as item_details
      FROM orders o
      LEFT JOIN LATERAL jsonb_array_elements_text(o.items) AS item_id ON true
      LEFT JOIN items i ON i.id = item_id::int
      LEFT JOIN vendor v ON v.id = o.vendor_id
      WHERE o.id = $1
      GROUP BY o.id, v.name
  `, [id]);
  

      if (result.rows.length === 0) {
          return res.status(404).send("Order not found");
      }
      res.render("order", {
          title: `Order Details - ${id}`,
          order: result.rows[0],
      });
  } catch (err) {
      console.error("Error fetching order details:", err.stack);
      res.status(500).send("Error fetching order details");
  }
});

app.get('/stats', async (req, res) => {
  const { start_date, end_date, item_type } = req.query;
  
  let whereClause = '';
  const queryParams = [];
  
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

  try {
    const result = await client.query(`
      WITH order_items AS (
        SELECT 
          o.id,
          i.item_type,
          i.quantity,
          i.price,
          i.currency
        FROM orders o
        JOIN LATERAL jsonb_array_elements_text(o.items) AS item_id ON true
        JOIN items i ON i.id = item_id::int
        WHERE 1=1 ${whereClause}
      )
      SELECT 
        COUNT(DISTINCT order_items.id) as order_count,
        SUM(CASE WHEN order_items.item_type = 'MIN' THEN order_items.quantity ELSE 0 END) as min_sold,
        jsonb_object_agg(currency_totals.currency, currency_totals.total_sum) as total_sums
      FROM (
        SELECT 
          currency, 
          SUM(price * quantity) as total_sum
        FROM order_items
        GROUP BY currency
      ) currency_totals
      CROSS JOIN order_items
      GROUP BY currency_totals.currency
    `, queryParams);
    
    
    
    console.log('Stats retrieved successfully:');
    console.log('Order count:', result.rows[0].order_count);
    console.log('MIN sold:', result.rows[0].min_sold);
    console.log('Total sums:', result.rows[0].total_sums);


    res.render('stats', {
      title: 'Order Statistics',
      stats: result.rows[0],
      filters: { start_date, end_date, item_type }
    });
  } catch (err) {
    console.error('Error fetching stats:', err.stack);
    res.status(500).send('Error fetching stats');
  }
  
});


app.post('/create-order', async (req, res) => {
  const { items, customer_info } = req.body;
  const client = await pool.connect();

  try {
      await client.query('BEGIN');

      const itemIds = [];
      const totalSums = {};

      for (const item of items) {
          const { rows } = await client.query(
              'INSERT INTO items (item_type, quantity, price, currency) VALUES ($1, $2, $3, $4) RETURNING id',
              [item.type, item.quantity, item.price, item.currency]
          );
          itemIds.push(rows[0].id);

          if (!totalSums[item.currency]) {
              totalSums[item.currency] = 0;
          }
          totalSums[item.currency] += item.price * item.quantity;
      }

      const { rows } = await client.query(
          'INSERT INTO orders (items, total_sums, customer_info) VALUES ($1, $2, $3) RETURNING id',
          [JSON.stringify(itemIds), JSON.stringify(totalSums), JSON.stringify(customer_info)]
      );

      await client.query('COMMIT');
      res.json({ orderId: rows[0].id });
  } catch (e) {
      await client.query('ROLLBACK');
      throw e;
  } finally {
      client.release();
  }
});
app.get('/purchases', async (req, res) => {
  try {
      const result = await client.query(`
          SELECT p.*, v.name AS vendor_name
          FROM purchases p
          JOIN vendor v ON v.id = p.vendor_id
          ORDER BY p.date DESC LIMIT 10
      `);
      res.render('purchases', { purchases: result.rows });
  } catch (err) {
      console.error('Error fetching purchases:', err.stack);
      res.status(500).send('Error fetching purchases');
  }
});
app.post('/purchases', async (req, res) => {
  const { vendor_id, items, driver, delivery_cost } = req.body;
  
  const total_cost = {};
  items.forEach(item => {
      if (!total_cost[item.currency]) {
          total_cost[item.currency] = 0;
      }
      total_cost[item.currency] += item.price * item.quantity;
  });

  try {
      await client.query(`
          INSERT INTO purchases (vendor_id, items, total_cost, driver, delivery_cost)
          VALUES ($1, $2, $3, $4, $5)
      `, [vendor_id, JSON.stringify(items), JSON.stringify(total_cost), driver, delivery_cost]);
      res.redirect('/purchases');
  } catch (err) {
      console.error('Error creating purchase:', err.stack);
      res.status(500).send('Error creating purchase');
  }
});
app.get('/add-purchase', async (req, res) => {
  try {
    const vendorResult = await client.query('SELECT id, name FROM vendor ORDER BY name');
    const driverResult = await client.query('SELECT id, name FROM driver ORDER BY name');
    res.render('add-purchase', { 
      vendors: vendorResult.rows,
      drivers: driverResult.rows,
      header: 0
    });
  } catch (err) {
    console.error('Error fetching data:', err.stack);
    res.status(500).send('Error fetching data');
  }
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const PORT = process.env.PORT || 3000;
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
