const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('403');
  }
  next();
}

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.findUserByUsername(username);

  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    req.flash('error', 'Неверный логин или пароль');
    return res.redirect('/login');
  }

  req.session.regenerate((err) => {
    if (err) {
      req.flash('error', 'Ошибка входа, попробуйте снова');
      return res.redirect('/login');
    }
    req.session.user = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };
    res.redirect(user.role === 'admin' ? '/admin' : '/');
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', requireAuth, (req, res) => {
  if (req.session.user.role === 'admin') {
    return res.redirect('/admin');
  }

  const subjects = db.listSubjects();
  const grades = db.getGrades(req.session.user.id);
  const gradesBySubject = new Map(grades.map((g) => [g.subjectId, g]));

  const rows = subjects.map((subject) => ({
    subject,
    grade: gradesBySubject.get(subject.id) || null,
  }));

  res.render('cabinet', { rows });
});

app.get('/admin', requireAuth, requireAdmin, (req, res) => {
  const students = db.listStudents();
  const subjects = db.listSubjects();
  const allGrades = db.read().grades;

  const gradeMap = {};
  for (const student of students) {
    gradeMap[student.id] = {};
    for (const subject of subjects) {
      const g = allGrades.find(
        (gr) => gr.studentId === student.id && gr.subjectId === subject.id
      );
      gradeMap[student.id][subject.id] = g ? g.value : '';
    }
  }

  res.render('admin', { students, subjects, gradeMap });
});

app.post('/admin/grades', requireAuth, requireAdmin, (req, res) => {
  const studentId = Number(req.body.studentId);
  const subjectId = Number(req.body.subjectId);
  const value = Number(req.body.value);

  const student = db.findUserById(studentId);
  const subject = db.listSubjects().find((s) => s.id === subjectId);

  if (!student || student.role !== 'student' || !subject) {
    req.flash('error', 'Некорректный студент или предмет');
    return res.redirect('/admin');
  }

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    req.flash('error', 'Оценка должна быть целым числом от 1 до 5');
    return res.redirect('/admin');
  }

  db.setGrade(studentId, subjectId, value);
  req.flash('success', `Оценка выставлена: ${student.fullName} — ${subject.name}: ${value}`);
  res.redirect('/admin');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
