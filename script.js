const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const categorySelect = document.getElementById('category-select');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('proTasksV2')) || [];

/* 🌙 DARK / LIGHT MODE */

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById("theme-icon");

    const currentTheme = html.getAttribute("data-theme");

    if (currentTheme === "dark") {
        html.setAttribute("data-theme", "light");
        localStorage.setItem("proTheme", "light");
        icon.className = "fas fa-moon";
    } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("proTheme", "dark");
        icon.className = "fas fa-sun";
    }
}

// Load saved theme ONCE
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("proTheme") || "light";
    const icon = document.getElementById("theme-icon");

    document.documentElement.setAttribute("data-theme", savedTheme);

    if (savedTheme === "dark") {
        icon.className = "fas fa-sun";
    } else {
        icon.className = "fas fa-moon";
    }

    updateUI(); // also load tasks on start
});

/* TASK SYSTEM */

function updateUI() {

    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.date && b.date) return new Date(a.date) - new Date(b.date);
        return a.date ? -1 : 1;
    });

    renderTasks();
    localStorage.setItem('proTasksV2', JSON.stringify(tasks));

    document.getElementById('total-tasks').innerText = tasks.length;
    document.getElementById('completed-tasks').innerText =
        tasks.filter(t => t.completed).length;
}

function renderTasks() {

    taskList.innerHTML = "";
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {

        const li = document.createElement('li');
        li.className = 'task-item';

        const isOverdue =
            task.date && task.date < today && !task.completed;

        const dateHTML = task.date ?
            `<span class="due-date ${isOverdue ? 'late' : ''}">
                <i class="far fa-calendar-alt"></i>
                ${task.date === today ? 'Today' : task.date}
            </span>` : "";

        li.innerHTML = `
            <div class="task-info">
                <span class="category-tag">${task.category}</span>
                <span style="${task.completed ? 'text-decoration: line-through; opacity: 0.5' : ''}">
                    ${task.text}
                </span>
                ${dateHTML}
            </div>
            <div class="actions">
                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"
                   onclick="toggleTask(${index})"
                   style="color:#10b981;"></i>
                <i class="fas fa-trash"
                   onclick="deleteTask(${index})"
                   style="color:#f87171;"></i>
            </div>
        `;

        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {

    const val = taskInput.value.trim();
    if (!val) return;

    tasks.push({
        text: val,
        date: taskDate.value,
        category: categorySelect.value,
        completed: false
    });

    taskInput.value = "";
    taskDate.value = "";

    updateUI();
});

window.toggleTask = function(i) {

    tasks[i].completed = !tasks[i].completed;

    if (tasks[i].completed) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    updateUI();
};

window.deleteTask = function(i) {

    const items = document.querySelectorAll('.task-item');

    items[i].style.transform = "translateX(100px)";
    items[i].style.opacity = "0";

    setTimeout(() => {
        tasks.splice(i, 1);
        updateUI();
    }, 300);
};