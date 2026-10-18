require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // built into Node 22.13+ (no install needed)

const dbFile = process.env.DB_FILE || './timetable_crud.db';
const db = new DatabaseSync(dbFile);

// Create table and seed sample data on first run only
const exists = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='timetable'")
  .get();

if (!exists) {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(sql);
  console.log('Database created and seeded from schema.sql');
}

module.exports = db;
