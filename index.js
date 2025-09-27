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



















}
)