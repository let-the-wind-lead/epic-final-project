const express = require('express');
const { auth } = require('express-openid-connect');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Auth0 configuration — your empire’s keys to the gates
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'auth0-secret', // this is what you wrote in docker-compose.yml
  baseURL: 'https://app.anacrnkovic-homework-nc.com',
  clientID: 'EVNciiDMZVqVQjX6LXlHx1BYzZ1XsJ7t',
  issuerBaseURL: 'https://ac-hw9.us.auth0.com'
};

app.use(auth(config));

// PostgreSQL config — match your docker-compose
const pool = new Pool({
  connectionString: 'postgres://epicuser:epicuser@db:5432/epicdb',
});

// 👑 Public route — your glittering welcome page
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Welcome to the Empress' App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        background: linear-gradient(120deg, #fbe8eb 0%, #f8edff 100%);
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        background: rgba(255,255,255,0.95);
        border-radius: 16px;
        box-shadow: 0 8px 32px 0 rgba(31,38,135,0.2);
        padding: 40px 32px;
        text-align: center;
        max-width: 400px;
      }
      h1 {
        color: #7a477d;
        margin-bottom: 0.5em;
      }
      .btn {
        display: inline-block;
        margin: 12px 8px;
        padding: 12px 28px;
        font-size: 1.1em;
        border-radius: 8px;
        border: none;
        background: #cfa0d6;
        color: #fff;
        text-decoration: none;
        transition: background 0.2s;
        box-shadow: 0 2px 8px rgba(102,166,255,0.15);
      }
      .btn:hover {
        background: #ffdee7;
        color: #7a477d;
      }
      .footer {
        margin-top: 2em;
        font-size: 0.95em;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🌸 Welcome, Empress</h1>
      <p>
        This realm showcases:<br>
        ✨ Auth0 Login<br>
        ✨ PostgreSQL queries<br>
        ✨ And HTTPS magic
      </p>
      <div>
        <a class="btn" href="/login">Log In</a>
        <a class="btn" href="/profile">Profile</a>
      </div>
      <div class="footer">
        <span><a href="https://auth0.com/docs/" target="_blank">Auth0 Docs</a></span>
      </div>
    </div>
  </body>
  </html>
  `);
});

// Protected profile route
app.get('/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`<h1>Profile</h1>
    <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
    <a href="/db">Show DB Users</a> | <a href="/logout">Logout</a>`);
});

// Protected DB route
app.get('/db', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('DB error: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🌐 App running at https://app.anacrnkovic-homework-nc.com`);
});
