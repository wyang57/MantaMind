const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  // Sort tasks by combined date and time
  tasks.sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time || '00:00'}`);
    const bDate = new Date(`${b.date}T${b.time || '00:00'}`);
    return aDate - bDate;
  });

  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.style.borderLeftColor = getCategoryColor(task.category);
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${task.date} ${task.time} • ${task.category}</small>
      </div>
      <div>
        <button onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">X</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}


function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}
let editIndex = null; // Track if you're editing an existing task

function editTask(index) {
  const task = tasks[index];
  document.getElementById('task').value = task.text;
  document.getElementById('date').value = task.date;
  document.getElementById('time').value = task.time;
  document.getElementById('category').value = 
    ['General', 'School', 'Project', 'Personal'].includes(task.category) ? 
    task.category : 'custom';
  document.getElementById('custom-category').value = 
    ['General', 'School', 'Project', 'Personal'].includes(task.category) ? 
    '' : task.category;

  editIndex = index;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('task').value.trim();
const date = document.getElementById('date').value;
const time = document.getElementById('time').value;
let category = document.getElementById('category').value;
const customCategory = document.getElementById('custom-category').value.trim();

if (category === 'custom' && customCategory) {
  category = customCategory;
}


  if (text && date) {
  const taskData = { text, date, time, category };

  if (editIndex !== null) {
    tasks[editIndex] = taskData;
    editIndex = null;
  } else {
    tasks.push(taskData);
  }

  saveTasks();
  renderTasks();
  form.reset();
}

});

function getCategoryColor(category) {
  switch (category) {
    case 'School': return '#007bff';
    case 'Project': return '#28a745';
    case 'Personal': return '#ffc107';
    default: return '#6c757d';
  }
}

renderTasks();
