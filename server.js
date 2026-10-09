
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32 ||
    JWT_SECRET === "REPLACE_WITH_A_LONG_RANDOM_SECRET") {
  throw new Error("Укажи надёжный JWT_SECRET в backend/.env");
}

const db = new Database(path.join(__dirname, "nexora.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5500"
}));
app.use(express.json({ limit: "20kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
});

function cleanText(value, max = 200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function createToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    JWT_SECRET,
    { expiresIn: "2h", issuer: "nexora-api", audience: "nexora-client" }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: "Требуется авторизация." });
  }

  try {
    req.auth = jwt.verify(match[1], JWT_SECRET, {
      issuer: "nexora-api",
      audience: "nexora-client"
    });

    next();
  } catch {
    return res.status(401).json({ error: "Сессия недействительна или истекла." });
  }
}

function requireAdmin(req, res, next) {
  const user = db.prepare("SELECT role FROM users WHERE id = ?")
    .get(Number(req.auth.sub));

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Недостаточно прав." });
  }

  next();
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "NEXORA API" });
});

app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  try {
    const firstName = cleanText(req.body.firstName, 80);
    const lastName = cleanText(req.body.lastName, 80);
    const email = cleanText(req.body.email, 254).toLowerCase();
    const phone = cleanText(req.body.phone, 30);
    const password = req.body.password;

    if (!firstName || !lastName ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Проверьте введённые данные." });
    }

    if (typeof password !== "string" ||
        password.length < 12 || password.length > 128) {
      return res.status(400).json({
        error: "Пароль должен содержать от 12 до 128 символов."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = db.prepare(`
      INSERT INTO users (first_name, last_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `).run(firstName, lastName, email, phone, passwordHash);

    const user = {
      id: Number(result.lastInsertRowid),
      firstName,
      lastName,
      email,
      phone,
      role: "customer"
    };

    res.status(201).json({
      user,
      token: createToken(user)
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Этот email уже зарегистрирован." });
    }
    next(error);
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const email = cleanText(req.body.email, 254).toLowerCase();
  const password = req.body.password;

  if (typeof password !== "string" || password.length > 128) {
    return res.status(400).json({ error: "Неверные учётные данные." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  const valid = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!valid) {
    return res.status(401).json({ error: "Неверный email или пароль." });
  }

  const safeUser = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  res.json({ user: safeUser, token: createToken(safeUser) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.prepare(`
    SELECT id, first_name AS firstName, last_name AS lastName,
           email, phone, role, created_at AS createdAt
    FROM users WHERE id = ?
  `).get(Number(req.auth.sub));

  if (!user) return res.status(401).json({ error: "Аккаунт не найден." });
  res.json({ user });
});

app.get("/api/products", (req, res) => {
  const products = db.prepare(`
    SELECT p.id, p.name, p.price_uzs AS price, p.old_price_uzs AS oldPrice,
           p.image_url AS image, p.description, p.stock, p.rating,
           b.name AS brand, c.slug AS category
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.id DESC
    LIMIT 200
  `).all();

  res.json({ products });
});

app.get("/api/orders", requireAuth, (req, res) => {
  const orders = db.prepare(`
    SELECT id, status, currency, subtotal_uzs, shipping_uzs,
           total_uzs, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY id DESC
  `).all(Number(req.auth.sub));

  res.json({ orders });
});

app.post("/api/orders", requireAuth, orderLimiter, (req, res, next) => {
  const body = req.body || {};
  const customer = body.customer || {};
  const items = body.items;

  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    return res.status(400).json({ error: "Некорректный список товаров." });
  }

  const firstName = cleanText(customer.firstName, 80);
  const lastName = cleanText(customer.lastName, 80);
  const phone = cleanText(customer.phone, 30);
  const email = cleanText(customer.email, 254).toLowerCase();
  const country = cleanText(customer.country, 80);
  const city = cleanText(customer.city, 100);
  const address = cleanText(customer.address, 250);
  const payment = cleanText(body.payment, 30);
  const currency = cleanText(body.currency, 3);

  if (!firstName || !lastName || !phone ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !country || !city || !address) {
    return res.status(400).json({ error: "Заполните все обязательные поля." });
  }

  if (!["UZS", "RUB", "USD"].includes(currency) ||
      !["card", "cash", "wallet", "transfer"].includes(payment)) {
    return res.status(400).json({ error: "Некорректный способ оплаты или валюта." });
  }

  try {
    const createOrder = db.transaction(() => {
      const normalized = [];
      let subtotal = 0;

      for (const item of items) {
        const id = Number(item.id);
        const quantity = Number(item.quantity);

        if (!Number.isInteger(id) || !Number.isInteger(quantity) ||
            quantity < 1 || quantity > 50) {
          throw new Error("Некорректное количество товара.");
        }

        const product = db.prepare(`
          SELECT id, name, price_uzs, stock
          FROM products WHERE id = ?
        `).get(id);

        if (!product || product.stock < quantity) {
          throw new Error("Товар отсутствует или недостаточно остатков.");
        }

        subtotal += product.price_uzs * quantity;
        normalized.push({ product, quantity });
      }

      const shipping = subtotal >= 1000000 ? 0 : 25000;
      const order = db.prepare(`
        INSERT INTO orders (
          user_id, status, currency, subtotal_uzs, shipping_uzs, total_uzs,
          first_name, last_name, phone, email, country, city, address, payment_method
        ) VALUES (?, 'processing', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        Number(req.auth.sub), currency, subtotal, shipping, subtotal + shipping,
        firstName, lastName, phone, email, country, city, address, payment
      );

      const addItem = db.prepare(`
        INSERT INTO order_items
          (order_id, product_id, product_name, unit_price_uzs, quantity)
        VALUES (?, ?, ?, ?, ?)
      `);

      const decreaseStock = db.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?"
      );

      for (const item of normalized) {
        addItem.run(
          order.lastInsertRowid,
          item.product.id,
          item.product.name,
          item.product.price_uzs,
          item.quantity
        );

        const update = decreaseStock.run(
          item.quantity, item.product.id, item.quantity
        );

        if (update.changes !== 1) {
          throw new Error("Не удалось зарезервировать товар.");
        }
      }

      return {
        id: Number(order.lastInsertRowid),
        subtotal,
        shipping,
        total: subtotal + shipping,
        currency
      };
    });

    const order = createOrder();
    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message || "Не удалось создать заказ." });
  }
});

app.get("/api/admin/stats", requireAuth, requireAdmin, (req, res) => {
  const products = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
  const users = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  const orders = db.prepare("SELECT COUNT(*) AS count FROM orders").get().count;
  const revenue = db.prepare(`
    SELECT COALESCE(SUM(total_uzs), 0) AS total FROM orders
  `).get().total;

  res.json({ products, users, orders, revenueUZS: revenue });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Внутренняя ошибка сервера." });
});

app.listen(PORT, () => {
  console.log(`NEXORA API запущен на http://localhost:${PORT}`);
});