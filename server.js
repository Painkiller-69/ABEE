const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Create the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: ''
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Connect Node application to MongoDB Atlas
const rollNo = 'U1205'; // Replace with your roll number
const uri = `mongodb+srv://Sparsh:Sparsh-123@link-shortener.dac5zyq.mongodb.net/?retryWrites=true&w=majority`; // Replace <your-password> with your MongoDB Atlas password

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB Atlas:', error);
  });

// Create Express application
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Multer configuration for file upload
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// Home route
app.get('/', (req, res) => {
  res.render('login');
});

// Signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup form submission
app.post('/signup', (req, res) => {
  const { name, emailAddress, password } = req.body;

  // Create a new user
  const newUser = new User({
    name,
    emailAddress,
    password
  });

  newUser.save()
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      console.log('Error creating user:', error);
      res.redirect('/signup');
    });
});

// Login form submission
app.post('/login', (req, res) => {
  const { emailAddress, password } = req.body;

  // Find the user with the provided email address
  User.findOne({ emailAddress })
    .then((user) => {
      if (user && user.password === password) {
        res.redirect('/dashboard');
      } else {
        res.redirect('/');
      }
    })
    .catch((error) => {
      console.log('Error finding user:', error);
      res.redirect('/');
    });
});

// Dashboard route (accessible only to logged-in users)
app.get('/dashboard', (req, res) => {
  // Retrieve the user details from the session or authentication mechanism
  const user = {
    name: 'John Doe',
    userImage: 'path_to_user_image.jpg' // Replace with the actual path to the user's image
  };

  res.render('dashboard', { user });
});

// Update user image route
app.get('/update-image', (req, res) => {
  res.render('update-image');
});

// Update user image form submission
app.post('/update-image', upload.single('userImage'), (req, res) => {
  const userImage = req.file ? req.file.path : '';

  // Update the user's image in the database
  // Retrieve the user details from the session or authentication mechanism
  const user = {
    name: 'John Doe',
    userImage
  };

  res.redirect('/dashboard');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
