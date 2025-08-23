import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, initDB, findUserByEmail, findUserById, findProductById } from './db.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end
app.use(express.static(path.join(__dirname, 'public')));

// --- Auth helpers ---
function issueToken(userId) {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.uid);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- API routes ---

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Products
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

app.get('/api/products/:id', async (req, res) => {
  await db.read();
  const p = findProductById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// Auth
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  await db.read();
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already used' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const user = { id: nanoid(), name, email, passwordHash: hash, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  await db.write();

  const token = issueToken(user.id);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  await db.read();
  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = issueToken(user.id);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', authRequired, (req, res) => {
  const { id, name, email, createdAt } = req.user;
  res.json({ id, name, email, createdAt });
});

// Orders
app.post('/api/orders', authRequired, async (req, res) => {
  const { items } = req.body; // [{ productId, qty }]
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items' });
  }
  await db.read();
  let total = 0;
  const orderItems = [];
  for (const it of items) {
    const product = findProductById(it.productId);
    const qty = Number(it.qty) || 1;
    if (!product || qty <= 0) continue;
    const lineTotal = product.price * qty;
    total += lineTotal;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty
    });
  }
  if (orderItems.length === 0) {
    return res.status(400).json({ error: 'No valid items' });
  }
  const order = {
    id: nanoid(),
    userId: req.user.id,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    status: 'created',
    createdAt: new Date().toISOString()
  };
  db.data.orders.push(order);
  await db.write();
  res.json(order);
});

app.get('/api/orders', authRequired, async (req, res) => {
  await db.read();
  const orders = db.data.orders.filter(o => o.userId === req.user.id);
  res.json(orders);
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
