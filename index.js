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

const STORAGE_KEY = 'taskboard.tasks';
let tasks = []




















}
)