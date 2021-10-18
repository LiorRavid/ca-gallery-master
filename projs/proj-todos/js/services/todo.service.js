'use strict'

var gTodos
_createTodos()

var gFilterBy = 'ALL'
var gSortBy = 'TXT'

function getTodosForDisplay() {
    if (gSortBy === 'TXT') gTodos.sort(_sortByTxt)
    else if (gSortBy === 'CREATED') gTodos.sort(_sortByCreated)
    else if (gSortBy === 'IMPORTANCE') gTodos.sort(_sortByImportance)
    if (gFilterBy === 'ALL') return gTodos;
    const todos = gTodos.filter(function (todo) {
        return (todo.isDone && gFilterBy === 'DONE') ||
            (!todo.isDone && gFilterBy === 'ACTIVE')
    })
    return todos 
}

function removeTodo(todoId) {
    const idx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos.splice(idx, 1);
    _saveTodosToStorage()
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo.id === todoId)
    todo.isDone = !todo.isDone;
    _saveTodosToStorage()
}

function addTodo(txt,importance) {
    const todo = _createTodo(txt)
    todo.importance = importance
    gTodos.push(todo);
    _saveTodosToStorage();
}

function getTodosCount() {
    return gTodos.length
}

function getActiveTodosCount() {
    const todos = gTodos.filter(function (todo) {
        return !todo.isDone
    })
    return todos.length
}

function setFilter(filterBy) {
    gFilterBy = filterBy
}

function getFilterBy(){
    return gFilterBy
}
function setSort(sortBy) {
    gSortBy = sortBy
}

function createdAt(timeStemp){
    return _getFormattedTime(timeStemp)
}

function _saveTodosToStorage(){
    saveToStorage('todosDB', gTodos)
}


function _createTodo(txt) {
    const todo = {
        id: _makeId(),
        txt: txt,
        isDone: false,
        timeStamp: _getTimeStemp(),
        importance:'1'
    }
    return todo;
}

function _createTodos() {
    var todos = loadFromStorage('todosDB')
    // Setup Demo data
    if (!todos || !todos.length) {
        todos = [
            _createTodo('Learn HTML'),
            _createTodo('Study CSS'),
            _createTodo('Master JS'),
        ];
    }
    gTodos = todos
    _saveTodosToStorage()
}


function _makeId(length=5) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var txt = '';
    for(var i=0; i < length; i++)  {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _getTimeStemp(){
    return Date.now()
}

function _getFormattedTime(ts) {
    var t = new Date(ts);

    var month = t.getMonth() + 1;
    var monthForDisplay = (month < 10) ? '0' + month : month;
    var date = t.getDate();
    var dateForDisplay = (date < 10) ? '0' + date : date;

    var res = t.getFullYear() + '-' + monthForDisplay
        + '-' + dateForDisplay + '  Time: ' + t.getHours() +
        ':' + t.getMinutes();
    return res
}

function _sortByTxt(a, b) {
    var txtA = a.txt.toUpperCase() 
            var txtB = b.txt.toUpperCase() 
            if (txtA < txtB) {
              return -1;
            }
            if (txtA > txtB) {
              return 1
            }
            return 0
}

function _sortByCreated (a, b) {
    return a.timeStamp - b.timeStamp
}

function _sortByImportance (a, b) {
    return a.importance - b.importance
}

function isTodos(todos){
    return(todos===[]||todos.length===0)
}






