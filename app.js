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
    const result = await client.query(
      "SELECT * FROM orders ORDER BY date DESC, id DESC LIMIT 10",
    );
    const ordersHtml = await ejs.renderFile(
      path.join(__dirname, "views", "orders.ejs"),
      { orders: result.rows },
      { async: true },
    );
    res.render("index", { title: "Orders", body: ordersHtml});
  } catch (err) {
    console.error("Error fetching orders:", err.stack);
    res.status(500).send("Error fetching orders"); // Или отобразите страницу с ошибкой
  }
});


app.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Order not found"); // Или отобразите страницу 404
    }
    res.render("order", {
      title: `Order Details - ${id}`,
      order: result.rows[0],
   
    });
  } catch (err) {
    console.error("Error fetching order details:", err.stack);
    res.status(500).send("Error fetching order details"); // Или отобразите страницу с ошибкой
  }
});

const PORT = process.env.PORT || 3000;
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
