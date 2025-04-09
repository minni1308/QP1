// Core Modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const passport = require('passport');
const mongoose = require('mongoose');

// Config
const config = require('./config');
const app = express();

// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(config.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport Initialization
app.use(passport.initialize());

// ─────────────────────────────────────────────────────────────
// Route Imports
// ─────────────────────────────────────────────────────────────

// Teacher routes
const teacherLogin = require('./routes/teachers/teacherLogin');
const teacherSignUp = require('./routes/teachers/teacherSignUp');
const teacherUpdate = require('./routes/teachers/teacherUpdate');
const forgetUser = require('./routes/teachers/teacherForget');
const subject = require('./routes/teachers/fetchSubjects');
const question = require('./routes/teachers/teacherQuestion');
const userAuth = require('./routes/teachers/userAuth');

// Question editing
const easyEdit = require('./routes/teachers/editQuestions/easyEdit');
const mediumEdit = require('./routes/teachers/editQuestions/mediumEdit');
const hardEdit = require('./routes/teachers/editQuestions/hardEdit');

// Paper Generation
const semPaper = require('./routes/teachers/paperGenerator/getsem/getSemester');
const mid1 = require('./routes/teachers/paperGenerator/getmid1/getMid1');
const mid2 = require('./routes/teachers/paperGenerator/getmid2/getMid2');
const schemaPaper = require('./routes/teachers/paperGenerator/getschema/getpaper');

// Admin routes
const adminDepartment = require('./routes/admin/department');
const adminSubject = require('./routes/admin/subject');

// ─────────────────────────────────────────────────────────────
// Route Mounting
// ─────────────────────────────────────────────────────────────

app.use('/teacher/signup', teacherSignUp);
app.use('/teacher/login', teacherLogin);
app.use('/teacher/update', teacherUpdate);
app.use('/teacher/forgot', forgetUser);
app.use('/teacher/subject', subject);
app.use('/teacher/question', question);
app.use('/user', userAuth);

app.use('/teacher/semPaper', semPaper);
app.use('/teacher/mid1', mid1);
app.use('/teacher/mid2', mid2);
app.use('/teacher/schema', schemaPaper);

app.use('/teacher/easy', easyEdit);
app.use('/teacher/medium', mediumEdit);
app.use('/teacher/hard', hardEdit);

app.use('/admin/department', adminDepartment);
app.use('/admin/subject', adminSubject);

// ─────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// ─────────────────────────────────────────────────────────────
// Server Init
// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4200;
app.set('port', PORT);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
