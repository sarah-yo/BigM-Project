-- Simple sqlite users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

INSERT INTO users(username, password) VALUES ('alice', 'password123'), ('bob', 'hunter2');
