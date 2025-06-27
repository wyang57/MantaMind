const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.style.borderLeftColor = getCategoryColor(task.category);
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${task.date} • ${task.category}</small>
      </div>
      <button class="delete" onclick="deleteTask(${index})">X</button>
    `;
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('task').value.trim();
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  if (text && date) {
    tasks.push({ text, date, category });
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
