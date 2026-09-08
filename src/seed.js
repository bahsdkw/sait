const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

const db = {
  users: [
    {
      id: 1,
      username: 'admin',
      passwordHash: hash('admin123'),
      role: 'admin',
      fullName: 'Администратор',
    },
    {
      id: 2,
      username: 'ivanov',
      passwordHash: hash('student123'),
      role: 'student',
      fullName: 'Иванов Иван',
    },
    {
      id: 3,
      username: 'petrova',
      passwordHash: hash('student123'),
      role: 'student',
      fullName: 'Петрова Анна',
    },
  ],
  subjects: [
    { id: 1, name: 'Математика' },
    { id: 2, name: 'Физика' },
    { id: 3, name: 'Информатика' },
    { id: 4, name: 'Литература' },
  ],
  grades: [
    { id: 1, studentId: 2, subjectId: 1, value: 5, updatedAt: new Date().toISOString() },
    { id: 2, studentId: 2, subjectId: 2, value: 4, updatedAt: new Date().toISOString() },
    { id: 3, studentId: 3, subjectId: 3, value: 5, updatedAt: new Date().toISOString() },
  ],
};

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
console.log('База данных инициализирована:', DB_PATH);
console.log('Логины: admin/admin123 (админ), ivanov/student123, petrova/student123 (студенты)');
