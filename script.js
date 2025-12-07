document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-task-btn");
    const list = document.getElementById("todo-list");
    const filterBtns = document.querySelectorAll(".control-btn");
    const clearCompleted = document.getElementById("clear-completed");

    let tasks = load();

    renderAll(tasks);

    addBtn.addEventListener("click", addTask);
    clearCompleted.addEventListener("click", clearCompletedTasks);

    filterBtns.forEach(btn =>
        btn.addEventListener("click", () => setFilter(btn))
    );

    function addTask() {
        const text = input.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text,
            completed: false,
        };

        tasks.push(task);
        save();
        render(task);

        input.value = "";
    }

    function render(task) {
        const li = document.createElement("li");
        li.id = task.id;
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        li.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return;

            task.completed = !task.completed;
            li.classList.toggle("completed");
            save();
        });

        li.querySelector(".edit-btn").addEventListener("click", () => editTask(task));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task, li));

        list.append(li);
    }

    function editTask(task) {
        const newText = prompt("Edit task:", task.text);
        if (!newText) return;

        task.text = newText.trim();
        save();
        refresh();
    }

    function deleteTask(task, li) {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        save();
    }

    function refresh() {
        list.innerHTML = "";
        renderAll(tasks);
    }

    function renderAll(arr) {
        arr.forEach(task => render(task));
    }

    function save() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function load() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(t => !t.completed);
        save();
        refresh();
    }

    function setFilter(btn) {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const type = btn.dataset.filter;

        let filtered = tasks;
        if (type === "active") filtered = tasks.filter(t => !t.completed);
        if (type === "completed") filtered = tasks.filter(t => t.completed);

        list.innerHTML = "";
        renderAll(filtered);
    }
});
