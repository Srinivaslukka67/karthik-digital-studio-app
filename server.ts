import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Database Setup
const db = new Database('studio.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    title TEXT,
    description TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    eventType TEXT,
    eventDate TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM portfolio').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO portfolio (url, title, description, category) VALUES (?, ?, ?, ?)');
  insert.run('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', 'Royal Wedding', 'A beautiful traditional wedding ceremony.', 'Wedding');
  insert.run('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', 'Classic Portrait', 'Elegant studio portrait session.', 'Portrait');
  insert.run('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600', 'Nature Escape', 'Scenic landscape photography.', 'Landscape');
}

// Email Setup
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS || EMAIL_USER.includes('placeholder')) {
  console.warn('⚠️ EMAIL NOT CONFIGURED: Please set EMAIL_USER and EMAIL_PASS in the Secrets panel.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER || 'placeholder@gmail.com',
    pass: EMAIL_PASS || 'placeholder_pass'
  }
});

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post('/api/register', async (req, res) => {
    const { name, phone } = req.body;
    console.log(`New user registered: ${name}, ${phone}`);
    
    try {
      await transporter.sendMail({
        from: '"Karthik Digital Studio" <no-reply@karthikstudio.com>',
        to: 'lalaboo884@gmail.com',
        subject: 'New App User Registration',
        text: `A new user has registered on the app:\n\nName: ${name}\nPhone: ${phone}`,
        html: `<div style="font-family: serif; color: #1a1a1a;">
                <h2 style="color: #d4af37;">New Registration</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
              </div>`
      });
    } catch (error) {
      console.error('Email error:', error);
    }
    
    res.json({ success: true });
  });

  app.post('/api/book', async (req, res) => {
    const { name, phone, eventType, eventDate, message } = req.body;
    
    db.prepare('INSERT INTO bookings (name, phone, eventType, eventDate, message) VALUES (?, ?, ?, ?, ?)')
      .run(name, phone, eventType, eventDate, message);

    try {
      await transporter.sendMail({
        from: '"Karthik Digital Studio" <no-reply@karthikstudio.com>',
        to: 'lalaboo884@gmail.com',
        subject: 'New Session Booking Request',
        text: `New booking request:\n\nName: ${name}\nPhone: ${phone}\nEvent: ${eventType}\nDate: ${eventDate}\nMessage: ${message}`,
        html: `<div style="font-family: serif; color: #1a1a1a;">
                <h2 style="color: #d4af37;">New Booking Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Event Date:</strong> ${eventDate}</p>
                <p><strong>Message:</strong> ${message}</p>
              </div>`
      });
    } catch (error) {
      console.error('Email error:', error);
    }

    res.json({ success: true });
  });

  // Portfolio Management
  app.get('/api/portfolio', (req, res) => {
    const items = db.prepare('SELECT * FROM portfolio ORDER BY id DESC').all();
    res.json(items);
  });

  app.post('/api/portfolio', (req, res) => {
    const { url, title, description, category } = req.body;
    const result = db.prepare('INSERT INTO portfolio (url, title, description, category) VALUES (?, ?, ?, ?)')
      .run(url, title, description, category);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/portfolio/:id', (req, res) => {
    db.prepare('DELETE FROM portfolio WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.put('/api/portfolio/:id', (req, res) => {
    const { title, description, category } = req.body;
    db.prepare('UPDATE portfolio SET title = ?, description = ?, category = ? WHERE id = ?')
      .run(title, description, category, req.params.id);
    res.json({ success: true });
  });

  // Admin Auth (Simple for demo, should be more secure)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'rambabu21') {
      res.json({ success: true, token: 'admin-token-21' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Vite middleware for development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
