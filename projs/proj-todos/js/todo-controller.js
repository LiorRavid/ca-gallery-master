"use strict";

function renderTodos() {
  const todos = getTodosForDisplay();
  if (todos.length === 0) {
    var filter = getFilterBy();
    if (filter === 'ALL') filter = '';
    const strHtmls = `NO ${filter} TODOS`;
    document.querySelector('.todo-list').innerText = strHtmls;
  }else{
    const strHtmls = todos.map(function (todo) {
      return `<li onclick="onToggleTodo('${
        todo.id
      }')" class="${todo.isDone ? "done" : ""}">
                      ${todo.txt}
                      <span> importance: ${todo.importance}</span>
                      <button onclick="onRemoveTodo(event, '${
                        todo.id
                      }')">x</button>
                      <span>created at ${createdAt(todo.timeStamp)}</span>
                  </li>`;
    });
    document.querySelector(".todo-list").innerHTML = strHtmls.join("");
    document.querySelector(".total-count").innerText = getTodosCount();
    document.querySelector(".active-count").innerText = getActiveTodosCount();
  }
}

function onRemoveTodo(ev, todoId) {
  ev.stopPropagation();
  var isConfirm = confirm("Do you want to delete this TODO?");
  if (!isConfirm) return;
  console.log("Removing todo", todoId);
  removeTodo(todoId);
  renderTodos();
}

function onToggleTodo(todoId) {
  console.log("Toggling todo", todoId);
  toggleTodo(todoId);
  renderTodos();
}

function onAddTodo() {
  const elTxt = document.querySelectorAll("input");
  const txt = elTxt[0].value;
  const importance = elTxt[1].value;
  if (importance >= 1 && importance <= 3 && txt !== "") {
    addTodo(txt, importance);
    renderTodos();
    elTxt.value = "";
  } else return;
}

function onSetFilter(filterBy) {
  console.log("Filtering By:", filterBy);
  setFilter(filterBy);
  renderTodos();
}

function onSetSort(sortBy) {
  setSort(sortBy);
  renderTodos();
}
