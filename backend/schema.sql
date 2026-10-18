-- Student Timetable & Goals (resource: timetable, table: timetable)
CREATE TABLE IF NOT EXISTS timetable (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code  VARCHAR(20) NOT NULL,
  course_name  VARCHAR(150),
  day_of_week  VARCHAR(15),
  start_time   VARCHAR(5),
  end_time     VARCHAR(5),
  venue        VARCHAR(100),
  lecturer     VARCHAR(100),
  study_goal   TEXT,
  goal_status  VARCHAR(20) DEFAULT 'Pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO timetable (course_code, course_name, day_of_week, start_time, end_time, venue, lecturer, study_goal, goal_status) VALUES
('ICT251', 'Web Application Development', 'Monday', '08:00', '10:00', 'Lab 1', 'Mr. Banda', 'Finish Node.js CRUD activity', 'In Progress'),
('ICT211', 'Database Systems', 'Monday', '10:30', '12:30', 'Room B12', 'Dr. Phiri', 'Revise normalization notes', 'Pending'),
('MAT201', 'Discrete Mathematics', 'Tuesday', '08:00', '10:00', 'Lecture Hall A', 'Mrs. Mwansa', 'Solve 20 graph theory problems', 'Pending'),
('ICT231', 'Operating Systems', 'Tuesday', '14:00', '16:00', 'Room C3', 'Mr. Zulu', 'Read chapter on process scheduling', 'In Progress'),
('ICT241', 'Computer Networks', 'Wednesday', '09:00', '11:00', 'Lab 2', 'Dr. Tembo', 'Practice subnetting questions', 'Completed'),
('COM201', 'Communication Skills', 'Wednesday', '13:00', '15:00', 'Room A5', 'Ms. Chanda', 'Prepare group presentation', 'In Progress'),
('ICT261', 'Software Engineering', 'Thursday', '08:00', '10:00', 'Lecture Hall B', 'Mr. Mumba', 'Draft SRS document', 'Pending'),
('ICT221', 'Data Structures', 'Thursday', '11:00', '13:00', 'Lab 1', 'Dr. Phiri', 'Implement linked list and tree in code', 'Completed'),
('STA201', 'Statistics for ICT', 'Friday', '09:00', '11:00', 'Room B4', 'Mrs. Lungu', 'Complete past paper 2023', 'Pending'),
('ICT271', 'Cyber Security Basics', 'Friday', '14:00', '16:00', 'Lab 2', 'Mr. Kasonde', 'Summarize encryption methods', 'In Progress'),
('ENT201', 'Entrepreneurship', 'Saturday', '09:00', '11:00', 'Auditorium', 'Ms. Mulenga', 'Write one-page business idea', 'Pending');
