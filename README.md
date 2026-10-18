# ICT251 Activity 4 – Single-Table CRUD App (Student Timetable & Goals)

Project chosen: **Question 3 – Student Timetable & Goals** (resource `timetable`, table `timetable`).
Stack: SQLite + Node.js/Express REST API + HTML/JavaScript frontend.

> The brief says SQLite in the intro but shows `mysql2` in the quick start. This project follows the SQLite
> instruction (no database server to install).

## Project structure

```
timetable-crud/
├─ backend/
│  ├─ .env            (PORT, DB_FILE)
│  ├─ package.json
│  ├─ schema.sql      (table + 11 sample records)
│  ├─ db.js           (opens SQLite, creates/seeds table on first run)
│  └─ server.js       (Express API, 5 endpoints, CORS)
└─ frontend/
   ├─ index.html      (form + table)
   └─ app.js          (fetch calls: GET, POST, PUT, DELETE)
```

## STEP 1 – Run it on your computer

Install Node.js (LTS) from https://nodejs.org first. Then in PowerShell:

```powershell
cd timetable-crud\backend
npm install
npm start
```

You should see `API running on http://localhost:3000`.
Open http://localhost:3000 in your browser: the frontend is served by the same server.

## STEP 2 – Table design (Part A)

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | |
| course_code | VARCHAR(20) NOT NULL | required by the brief |
| course_name | VARCHAR(150) | required by the brief |
| day_of_week | VARCHAR(15) | extra field |
| start_time | VARCHAR(5) | extra field |
| end_time | VARCHAR(5) | extra field |
| venue | VARCHAR(100) | extra field |
| lecturer | VARCHAR(100) | extra field |
| study_goal | TEXT | extra field (the "Goals" part) |
| goal_status | VARCHAR(20) DEFAULT 'Pending' | Pending / In Progress / Completed |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP (set on every PUT) | |

11 sample records are inserted by `schema.sql` automatically on first run (requirement: at least 10).

## STEP 3 – Test every endpoint in Postman (record a VIDEO)

Use Postman Desktop with a screen recorder (Windows: Win + G, or OBS). Base URL: `http://localhost:3000`.
Show URL, method, body and the JSON response for each request:

| # | Method | URL | Body (raw → JSON) | Expected |
|---|---|---|---|---|
| 1 | GET | `/api/timetable` | none | 200, array of all entries |
| 2 | GET | `/api/timetable/1` | none | 200, one entry |
| 3 | POST | `/api/timetable` | see below | 201, new entry with new id |
| 4 | PUT | `/api/timetable/12` (use the id from step 3) | see below | 200, updated entry |
| 5 | DELETE | `/api/timetable/12` | none | 200, `{"message":"Timetable entry deleted"}` |

POST body:
```json
{
  "course_code": "ICT281",
  "course_name": "Mobile App Development",
  "day_of_week": "Monday",
  "start_time": "14:00",
  "end_time": "16:00",
  "venue": "Lab 3",
  "lecturer": "Mr. Sakala",
  "study_goal": "Build a simple Android to-do app",
  "goal_status": "Pending"
}
```

PUT body:
```json
{
  "course_code": "ICT281",
  "course_name": "Mobile App Development",
  "day_of_week": "Tuesday",
  "start_time": "15:00",
  "end_time": "17:00",
  "venue": "Lab 3",
  "lecturer": "Mr. Sakala",
  "study_goal": "Build and test a simple Android to-do app",
  "goal_status": "In Progress"
}
```

For POST/PUT set Body → raw → JSON. After step 5 run GET all again to show the entry is gone.
Then repeat the five requests with your **deployed URL** (Step 5) so the video also proves the cloud version works.

## STEP 4 – Frontend check (Part C)

In the browser page: add an entry with the form, see it appear in the table, click Edit (values load into the form),
save (PUT), then Delete. The table refreshes after every operation.

## STEP 5 – Deploy to the cloud

Easiest for Node + Express: **Render** (free tier).

1. Create a GitHub repository and upload the whole `timetable-crud` folder.
   Add a `.gitignore` file containing `node_modules` and `*.db`.
2. Go to https://render.com → sign up with GitHub → **New → Web Service** → pick your repo.
3. Settings: Root Directory `backend`, Build Command `npm install`, Start Command `npm start`, Instance type Free.
4. Under **Environment** add `DB_FILE` = `./timetable_crud.db` (Render sets PORT itself).
5. Click **Create Web Service**. You get a URL such as `https://my-timetable-api.onrender.com`.
6. Test: `https://YOUR-URL/api/timetable` should show JSON; `https://YOUR-URL/` shows the frontend.

On Render's free tier the disk is temporary, so the database returns to the 11 sample records after a restart.
The first request after idle time can take about a minute.

## STEP 6 – What to submit on the Google Form (deadline 19 October 2026)

- API links (same base URL):
  - GET list: `https://YOUR-URL/api/timetable`
  - GET one: `https://YOUR-URL/api/timetable/1`
  - POST: `https://YOUR-URL/api/timetable`
  - PUT: `https://YOUR-URL/api/timetable/1`
  - DELETE: `https://YOUR-URL/api/timetable/1`
- Link to the Postman demo video (Google Drive or YouTube unlisted, "anyone with the link").
- Link to your GitHub repo.

## Troubleshooting

- `npm install` fails on better-sqlite3: update Node to the current LTS and retry.
- "Could not reach the API": the backend is not running, or `API_URL` in `frontend/app.js` is wrong.
- Port already in use: change `PORT` in `.env`.
