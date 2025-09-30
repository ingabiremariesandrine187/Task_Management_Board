// Wrap everything to avoid global scope pollution
(function() {
  // ---------------- Utilities ----------------
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString();
  }

  function addDaysISO(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  }

  // ---------------- State ----------------
  const STORAGE_KEY = 'taskboard.tasks';
  let tasks = [];

  // ---------------- Persistence ----------------
  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : sampleTasks();
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
    updateStats();
    renderDueList(); // <-- new line for Analytics page
  }

  // ---------------- Sample Tasks ----------------
  function sampleTasks() {
    return [
      { id: uid(), name: 'Self Study', dueDate: addDaysISO(3), status: 'pending', createdAt: Date.now() },
      { id: uid(), name: 'Praying', dueDate: addDaysISO(1), status: 'completed', createdAt: Date.now() - 86400000 },
      { id: uid(), name: 'Telling  story', dueDate: addDaysISO(7), status: 'pending', createdAt: Date.now() - 7200000 },
      { id: uid(), name: 'Coding', dueDate: addDaysISO(5), status: 'pending', createdAt: Date.now() - 10800000 },
      { id: uid(), name: 'Singing', dueDate: addDaysISO(2), status: 'completed', createdAt: Date.now() - 14400000 }
    ];
  }

  // ---------------- DOM References ----------------
  const taskListEl = document.getElementById('task-list');
  const taskForm = document.getElementById('task-form');
  const taskNameInput = document.getElementById('task-name');
  const taskDueInput = document.getElementById('task-due');
  const clearBtn = document.getElementById('clear-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortDateBtn = document.getElementById('sort-date');
  const clearStorageBtn = document.getElementById('clear-storage');
  const statTotalEl = document.getElementById('stat-total') || document.getElementById('a-total');
  const statCompletedEl = document.getElementById('stat-completed') || document.getElementById('a-completed');
  const statPendingEl = document.getElementById('stat-pending') || document.getElementById('a-pending');

  const dueListEl = document.getElementById('due-list'); // <-- Analytics list reference

  // ---------------- Render Functions ----------------
  function renderTasks(filter = 'all') {
    if (!taskListEl) return;

    taskListEl.innerHTML = '';

    let filteredTasks = tasks;  
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.status === 'completed');
    if (filter === 'pending') filteredTasks = tasks.filter(t => t.status === 'pending');

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `p-3 bg-white rounded-lg shadow flex justify-between items-center transition hover:shadow-md
        ${task.status === 'completed' ? 'line-through text-slate-400 bg-slate-100' : ''}`;
      
      li.innerHTML = ` 
  <div class="flex flex-col">
    <span class="task-name cursor-pointer">${task.name}</span>
    <span class="text-xs text-slate-500">Due: ${fmtDate(task.dueDate)}</span>
  </div>
  <div class="flex gap-2 items-center">
    <button class="toggle-btn px-2 py-1 rounded text-white ${task.status==='completed'?'bg-amber-500':'bg-emerald-600'}">
      ${task.status==='completed'?'Undo':'Done'}
    </button>
    <button class="edit-btn px-2 py-1 rounded border">Edit</button>
    <button class="delete-btn px-2 py-1 rounded border text-red-500 flex items-center justify-center">
      <!-- Inline SVG Trash Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
      </svg>
    </button>
  </div>
`;

      li.querySelector('.toggle-btn').addEventListener('click', () => toggleComplete(task.id));
      li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
      li.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
      taskListEl.appendChild(li);
    });
  }

  // ---------------- Render Analytics Due List ----------------
  function renderDueList() {
    if (!dueListEl) return;

    dueListEl.innerHTML = '';

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    sortedTasks.forEach(task => {
      const div = document.createElement('div');
      div.className = `p-3 border rounded bg-white text-slate-800 flex justify-between items-center hover:shadow transition`;
      div.innerHTML = `
        <span>${task.name}</span>
        <span class="text-sm text-slate-500">${fmtDate(task.dueDate)}</span>
      `;
      dueListEl.appendChild(div);
    });
  }

  function updateStats() {
    if (!statTotalEl) return;
    statTotalEl.textContent = tasks.length;
    statCompletedEl.textContent = tasks.filter(t => t.status === 'completed').length;
    statPendingEl.textContent = tasks.filter(t => t.status === 'pending').length;
  }

  // ---------------- CRUD Functions ----------------
  function addTask(name, dueDate) {
    if (!name) return alert('Task name cannot be empty');
    tasks.push({ id: uid(), name, dueDate, status: 'pending', createdAt: Date.now() });
    saveTasks();
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newName = prompt('Edit task name', task.name);
    const newDue = prompt('Edit due date (YYYY-MM-DD)', task.dueDate);
    if (newName !== null) task.name = newName.trim() || task.name;
    if (newDue !== null) task.dueDate = newDue;
    saveTasks();
  }

  function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  }

  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    saveTasks();
  }

  // ---------------- Filters & Sort ----------------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderTasks(btn.dataset.filter);
    });
  });

  if (sortDateBtn) {
    sortDateBtn.addEventListener('click', () => {
      tasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
      saveTasks();
    });
  }

  if (clearStorageBtn) {
    clearStorageBtn.addEventListener('click', () => {
      if(confirm('Reset all tasks?')) {
        tasks = sampleTasks();
        saveTasks();
      }
    });
  }

  // ---------------- Form Submission ----------------
  if(taskForm) {
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      addTask(taskNameInput.value, taskDueInput.value);
      taskNameInput.value = '';
      taskDueInput.value = '';
    });
  }

  if(clearBtn) {
    clearBtn.addEventListener('click', () => {
      taskNameInput.value = '';
      taskDueInput.value = '';
    });
  }

  // ---------------- Initialize ----------------
  loadTasks();
  renderTasks();
  updateStats();
  renderDueList(); // <-- render Analytics list on load

})();

 const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });