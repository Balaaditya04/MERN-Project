const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/college', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schemas and Models
const teacherSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const questionSchema = new mongoose.Schema({
  subjectCode: String,
  questionText: String,
  options: [String],
  correctAnswer: String,
});

const resultSchema = new mongoose.Schema({
  studentEmail: String,
  subjectCode: String,
  score: Number,
});

const Question = mongoose.model('Question', questionSchema);
const Result = mongoose.model('Result', resultSchema);

const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);

// Serve landing page at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Teacher Profile Route
app.get('/teacher-profile', async (req, res) => {
  const { email } = req.query;
  try {
    const teacher = await Teacher.findOne({ email });
    res.json(teacher);
  } catch (error) {
    res.status(500).send('Error fetching teacher profile');
  }
});

// Student Profile Route
app.get('/student-profile', async (req, res) => {
  const { email } = req.query;
  try {
    const student = await Student.findOne({ email });
    res.json(student);
  } catch (error) {
    res.status(500).send('Error fetching student profile');
  }
});

// Create Test Route
app.post('/create-test', async (req, res) => {
  const { subjectCode, timer, questions } = req.body;
  try {
    const questionsWithSubjectCode = questions.map(q => ({
      ...q,
      subjectCode,
    }));
    await Question.insertMany(questionsWithSubjectCode);
    res.status(200).send('Test created successfully');
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).send('Error creating test');
  }
});


// Attempt Test Route
app.get('/attempt-test', async (req, res) => {
  const { subjectCode } = req.query;
  try {
    const questions = await Question.find({ subjectCode });
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No test found for this subject code' });
    }
    res.json(questions);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).send('Error fetching test');
  }
});


// Submit Test Route
app.post('/submit-test', async (req, res) => {
  const { studentEmail, subjectCode, answers } = req.body;
  try {
    const questions = await Question.find({ subjectCode });
    let score = 0;
    questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) score++;
    });

    const result = new Result({ studentEmail, subjectCode, score });
    await result.save();

    await Question.deleteMany({ subjectCode });  // Remove test questions after submission
    res.status(200).send('Test submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting test');
  }
});

// Fetch Results Route
app.get('/fetch-results', async (req, res) => {
  const { studentEmail } = req.query;
  try {
    const results = await Result.find({ studentEmail });
    res.json(results);
  } catch (error) {
    res.status(500).send('Error fetching results');
  }
});

// Routes for Registration and Login
app.post('/register', async (req, res) => {
  const { fullName, email, password, user } = req.body;

  try {
    if (user === 'Teacher') {
      const teacher = new Teacher({ fullName, email, password });
      await teacher.save();
    } else if (user === 'Student') {
      const student = new Student({ fullName, email, password });
      await student.save();
    }
    res.status(200).send('Successfully registered! Please go to the login page.');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { email, password, user } = req.body;

  try {
    let foundUser;
    if (user === 'Teacher') {
      foundUser = await Teacher.findOne({ email, password });
      if (foundUser) {
        res.json({ redirectUrl: '/teacher-dashboard.html', fullName: foundUser.fullName });
        return;
      }
    } else if (user === 'Student') {
      foundUser = await Student.findOne({ email, password });
      if (foundUser) {
        res.json({ redirectUrl: '/student-dashboard.html', fullName: foundUser.fullName });
        return;
      }
    }

    res.status(401).send('Invalid email or password');
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

// Server listening
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
