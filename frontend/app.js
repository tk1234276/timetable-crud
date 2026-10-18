// IMPORTANT: after deployment, if the frontend is hosted separately, change this to your
// deployed backend URL, e.g. 'https://my-timetable-api.onrender.com/api/timetable'.
// When served by the same Express server, '/api/timetable' works as it is.
const API_URL = (location.protocol === 'file:' || location.port === '5500')
  ? 'http://localhost:3000/api/timetable'
  : '/api/timetable';

const form = document.getElementById('entryForm');
const rows = document.getElementById('rows');
const msg = document.getElementById('msg');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');
const fields = ['course_code', 'course_name', 'day_of_week', 'start_time', 'end_time',
  'venue', 'lecturer', 'study_goal', 'goal_status'];

function showMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? '#dc2626' : '#16a34a';
  setTimeout(() => (msg.textContent = ''), 3000);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// READ: list all records
async function loadEntries() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    rows.innerHTML = data.map(e => `
      <tr>
        <td>${e.id}</td>
        <td>${esc(e.course_code)}</td>
        <td>${esc(e.course_name)}</td>
        <td>${esc(e.day_of_week)}</td>
        <td>${esc(e.start_time)}${e.end_time ? ' - ' + esc(e.end_time) : ''}</td>
        <td>${esc(e.venue)}</td>
        <td>${esc(e.lecturer)}</td>
        <td>${esc(e.study_goal)}</td>
        <td><span class="badge ${esc(String(e.goal_status).replace(' ', '-'))}">${esc(e.goal_status)}</span></td>
        <td class="actions">
          <button class="edit" onclick="editEntry(${e.id})">Edit</button>
          <button class="del" onclick="deleteEntry(${e.id})">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) {
    showMsg('Could not reach the API: ' + err.message, true);
  }
}

function resetForm() {
  form.reset();
  document.getElementById('entryId').value = '';
  formTitle.textContent = 'Add a timetable entry';
  cancelBtn.hidden = true;
}

// CREATE (POST) or UPDATE (PUT)
form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const id = document.getElementById('entryId').value;
  const body = {};
  fields.forEach(f => (body[f] = document.getElementById(f).value));

  try {
    const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    showMsg(id ? 'Entry updated' : 'Entry created');
    resetForm();
    loadEntries();             // refresh the UI
  } catch (err) {
    showMsg(err.message, true);
  }
});

// EDIT: load one record into the form (GET one), then save via PUT
async function editEntry(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const e = await res.json();
  document.getElementById('entryId').value = e.id;
  fields.forEach(f => (document.getElementById(f).value = e[f] ?? ''));
  formTitle.textContent = `Edit entry #${e.id}`;
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DELETE
async function deleteEntry(id) {
  if (!confirm('Delete this entry?')) return;
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) { showMsg('Entry deleted'); loadEntries(); }
  else showMsg('Delete failed', true);
}

cancelBtn.addEventListener('click', resetForm);
loadEntries();
