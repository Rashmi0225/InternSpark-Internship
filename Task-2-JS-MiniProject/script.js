const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTaskHandler);
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTaskHandler();
});

function addTaskHandler() {
    const title = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!title || !deadline) {
        alert("Please enter task title and deadline.");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        deadline,
        dateAdded: new Date().toLocaleDateString(),
        completed: false
    };

    createTaskCard(task);
    saveTask(task);

    taskInput.value = "";
    deadlineInput.value = "";
}

function createTaskCard(task) {
    emptyMessage.style.display = "none";

    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;

    const today = new Date().toISOString().split("T")[0];

    let statusClass = "pending";
    let statusText = "Pending";

    if (task.completed) {
        statusClass = "completed";
        statusText = "Completed";
    } else if (task.deadline < today) {
        statusClass = "overdue";
        statusText = "Overdue";
    }

    card.innerHTML = `
        <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                Added: ${task.dateAdded} | Deadline: ${task.deadline}
                <span class="status ${statusClass}">${statusText}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn">✔</button>
            <button class="delete-btn">✖</button>
        </div>
    `;

    card.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(task.id));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(card);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(createTaskCard);

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    }
}

function toggleComplete(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refresh();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refresh();
}

function refresh() {
    taskList.innerHTML = "";
    loadTasks();
}
