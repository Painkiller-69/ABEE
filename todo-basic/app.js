const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Task 1: Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Task 2: Add Task UI
app.get('/addtask', (req, res) => {
  res.sendFile(__dirname + '/public/addtask.html');
});

// Task 3: Receive and store data
app.post('/addtask', (req, res) => {
  const { task } = req.body;

  if (!task) {
    res.status(400).send('Task is required');
    return;
  }

  fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let tasks = [];
    if (data) {
      tasks = JSON.parse(data);
    }

    tasks.push({ task });
    fs.writeFile('tasks.json', JSON.stringify(tasks), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/tasks');
    });
  });
});

// Task 4: View tasks
app.get('/tasks', (req, res) => {
  fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const tasks = JSON.parse(data);
    let taskList = '';
    if (tasks.length > 0) {
      taskList = '<ul>';
      tasks.forEach((task) => {
        taskList += `<li>${task.task}</li>`;
      });
      taskList += '</ul>';
    } else {
      taskList = '<p>No tasks available</p>';
    }

    res.send(`<h2>Tasks</h2>${taskList}<a href="/addtask">Add Task</a>`);
  });
});

// Task 5: Page not found
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Todo app listening at http://localhost:${port}`);
});
