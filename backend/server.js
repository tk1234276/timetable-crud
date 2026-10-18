require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());           // allow the HTML page to call the API
app.use(express.json());   // parse JSON request bodies

// Serve the frontend from the same server (handy for cloud deployment)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const FIELDS = [
  'course_code', 'course_name', 'day_of_week', 'start_time',
  'end_time', 'venue', 'lecturer', 'study_goal', 'goal_status'
];

// GET /api/timetable -> list all records
app.get('/api/timetable', (req, res) => {
  res.json(db.prepare('SELECT * FROM timetable ORDER BY id').all());
});

// GET /api/timetable/:id -> get one record
app.get('/api/timetable/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM timetable WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Timetable entry not found' });
  res.json(row);
});

// POST /api/timetable -> create a record
app.post('/api/timetable', (req, res) => {
  const b = req.body;
  if (!b.course_code || !String(b.course_code).trim()) {
    return res.status(400).json({ error: 'course_code is required' });
  }
  const values = FIELDS.map(f => {
    if (f === 'course_code') return String(b.course_code).trim();
    if (f === 'goal_status') return b.goal_status || 'Pending';
    return b[f] || null;
  });
  const info = db
    .prepare(`INSERT INTO timetable (${FIELDS.join(', ')}) VALUES (${FIELDS.map(() => '?').join(', ')})`)
    .run(...values);
  res.status(201).json(db.prepare('SELECT * FROM timetable WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/timetable/:id -> update a record
app.put('/api/timetable/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM timetable WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Timetable entry not found' });

  const b = req.body;
  const merged = {};
  FIELDS.forEach(f => (merged[f] = b[f] !== undefined ? b[f] : existing[f]));
  if (!merged.course_code || !String(merged.course_code).trim()) {
    return res.status(400).json({ error: 'course_code cannot be empty' });
  }

  db.prepare(
    `UPDATE timetable SET ${FIELDS.map(f => `${f} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).run(...FIELDS.map(f => merged[f]), req.params.id);

  res.json(db.prepare('SELECT * FROM timetable WHERE id = ?').get(req.params.id));
});

// DELETE /api/timetable/:id -> delete a record
app.delete('/api/timetable/:id', (req, res) => {
  const info = db.prepare('DELETE FROM timetable WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Timetable entry not found' });
  res.json({ message: 'Timetable entry deleted', id: Number(req.params.id) });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
