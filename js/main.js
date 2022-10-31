// Находим элементы на странице

const form = document.querySelector('#form');
const input = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyItem = document.querySelector('#emptyList');

let tasks = [];

// Проверяем local str если там что-то есть, присваиваем нашему массиву эти данные
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    // Добавляем данные в разметку
    tasks.forEach(item => renderTasks(item));
}

// Проверяем нужно ли добавить блок "Список задач пуст"
checkEmptyList();

form.addEventListener('submit', addNewTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

function addNewTask(event) {
    event.preventDefault();

    const inputText = input.value;

    // Добавляем задачи в массив
    const newTask = {
        id: Date.now(),
        text: inputText,
        condition: false,
    }
    tasks.push(newTask);

    renderTasks(newTask);

    input.value = "";

    input.focus();

    checkEmptyList();

    saveToLocalStorage();

}
function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;
    const parentNode = event.target.closest('.list-group-item');
    parentNode.remove();
    // Находим задачу по id
    const taskID = Number(parentNode.id);
    // Фильтруем массив, те задачи которые равны id текущей задачи, попадают в новый массив 
    tasks = tasks.filter((item) => item.id !== taskID);

    checkEmptyList();

    saveToLocalStorage();
}
function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest('.list-group-item');
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    // Ищем задачу в массиве
    const taskID = Number(parentNode.id);
    const findDone = tasks.find((item) => item.id === taskID)
    // После каждого клика будет присваиваться обратное значение condition в массиве задач
    findDone.condition = !findDone.condition

    saveToLocalStorage();
}
function checkEmptyList() {
    const emptyListHTML = `
    <li 
    id="emptyList" class="list-group-item empty-list">
	<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
	<div class="empty-list__title">Список дел пуст</div>
	</li
    `
    if (tasks.length === 0) {
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks(item) {
    // Проверяем состояние задачи
    const conditionTask = item.condition ? 'task-title task-title--done' : 'task-title';

    const HTMLtask =
        `
    <li id="${item.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${conditionTask}">${item.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>
    `;

    taskList.insertAdjacentHTML('beforeend', HTMLtask);
}
