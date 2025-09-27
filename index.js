(function() {
function uid() {
    return Date.now().to String(36) +Math.random().toString(36).slice(2,8);
}
function fmtDate(iso){
    if(!iso) return '';
    return new Date(iso).toLocaleDateString();
}
function addDaysISO(n) {
    const d = new Date();
    d.setDate(d.getDate() +n);
    return d.toISOString().split('T')[0];
}
    //state
const STORAGE_KEY = 'taskboard.tasks';
let tasks = [];
 //persistence
function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : sampleTasks();
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));
    renderTasks();
    updateStats();
    renderDueList(); //new line for analytic page
  
}

//sample Tasks
function sampleTasks(){
    return [
  {id:uid(), name:'self Study',dueDate: addDaysISO(3),status:'pending',createdAt:Date.now()},
  {id:uid(),name:'Praying',dueDate:addDaysISO(1),status:'completed',createdAt:Date.now() -86400000},
  {id:uid(),name:'Telling story',dueDate:addDaysISO(7),status:'pending',createdAt:Date.now() -7200000},
  {id:uid(),name:'coding',dueDate:addDaysISO(5),status:'pending',createdAt:Date.now() - 10800000},
  {id:uid(),name:'singing',dueDate:addDaysISO(2),status:'completed',createdAt:Date.now() - 14400000}

    ];
}
//DOM References
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

 const dueListEl = document.getElementById('due-list'); //analytics list reference

 //Render Functions
 function renderTasks(filter = 'all'){
    if(!taskListEl) return;

    taskListEl.innerHTML='';
    let filteredTasks = tasks;
    if (filter === 'completed') filteredTasks = tasks.filter(t =>t.status === 'completed');
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
          <button class="delete-btn px-2 py-1 rounded border text-red-500">Delete</button>
        </div>
      `;
      li.querySelector('toggle-btn').addEventListener('click', () => toggleComplete(task.id));
      li.querySelector('delete-btn').addEventListener('click', () => deleteTask(task.id));
      li.querySelector('.edit-btn').addEventListener('click' , () => editTask(task.id));
      taskListEl.appendChild(li);
     });
 }
 











}
)