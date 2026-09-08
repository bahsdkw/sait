const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function read() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function findUserByUsername(username) {
  const db = read();
  return db.users.find((u) => u.username === username);
}

function findUserById(id) {
  const db = read();
  return db.users.find((u) => u.id === id);
}

function listStudents() {
  const db = read();
  return db.users.filter((u) => u.role === 'student');
}

function listSubjects() {
  const db = read();
  return db.subjects;
}

function getGrades(studentId) {
  const db = read();
  return db.grades.filter((g) => g.studentId === studentId);
}

function setGrade(studentId, subjectId, value) {
  const db = read();
  const existing = db.grades.find(
    (g) => g.studentId === studentId && g.subjectId === subjectId
  );
  if (existing) {
    existing.value = value;
    existing.updatedAt = new Date().toISOString();
  } else {
    db.grades.push({
      id: db.grades.length ? Math.max(...db.grades.map((g) => g.id)) + 1 : 1,
      studentId,
      subjectId,
      value,
      updatedAt: new Date().toISOString(),
    });
  }
  write(db);
}

module.exports = {
  read,
  write,
  findUserByUsername,
  findUserById,
  listStudents,
  listSubjects,
  getGrades,
  setGrade,
};
