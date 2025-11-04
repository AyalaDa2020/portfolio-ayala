import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/adsdb';
const PORT = parseInt(process.env.PORT || '8000', 10);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

const client = new MongoClient(MONGO_URI);
let col;

async function init() {
  await client.connect();
  // derive db name from URI path or default to 'adsdb'
  let dbName = 'adsdb';
  try {
    const u = new URL(MONGO_URI);
    dbName = (u.pathname || '').replace('/', '') || 'adsdb';
  } catch {}
  const db = client.db(dbName);
  col = db.collection('clients');
}

// API
app.get('/api/clients', async (req, res) => {
  try {
    const items = await col.find({}).sort({ created_at: -1 }).toArray();
    res.status(200).json(items.map(d => ({ ...d, _id: String(d._id) })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, email, package_type, quota, start_date, end_date } = req.body || {};
    const required = { name, email, package_type, quota, start_date };
    const missing = Object.entries(required).filter(([k, v]) => !v).map(([k]) => k);
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });

    const doc = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      package_type: String(package_type).trim(),
      quota: parseInt(quota, 10),
      start_date: String(start_date).trim(),
      end_date: end_date ? String(end_date).trim() : null,
      created_at: new Date(),
    };

    const result = await col.insertOne(doc);
    res.status(201).json({ ...doc, _id: String(result.insertedId) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

init().then(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to init app', err);
  process.exit(1);
});
