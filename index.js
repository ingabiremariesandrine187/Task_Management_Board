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
 }
 











}
)