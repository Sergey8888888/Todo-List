const addTask = document.querySelector(".form");
const input = document.querySelector(".todo_list");
const clearBtn = document.querySelector(".clear");
const todoFilter = document.querySelector(".todo_filter");
const itemsLeft = document.querySelector(".items_left");
const textInput = document.querySelector(".todo_text");

addTask.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = textInput.value;
  if (inputValue === "") {
    return alert("Необходимо ввести задачу");
  }
  const task = document.createElement("li");
  task.classList.add("task");
  input.appendChild(task);
  textInput.value = "";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task_checkbox");
  checkbox.dataset.completed = "true";
  checkbox.addEventListener("change", (e) => {
    if (e.target.dataset.completed === "true") {
      const parentNode = e.target.closest(".task");
      const taskTitle = parentNode.querySelector(".task_title");
      taskTitle.classList.toggle("done");

      parentNode.classList.toggle("completed");
      e.target.dataset.completed = "false";
    } else {
      const parentNode = e.target.closest(".task");
      const taskTitle = parentNode.querySelector(".task_title");
      taskTitle.classList.toggle("done");
      parentNode.classList.toggle("completed");
      e.target.dataset.completed = "true";
    }

    saveHistory();
    leftItems();
  });
  task.appendChild(checkbox);

  const taskTitle = document.createElement("span");
  taskTitle.classList.add("task_title");
  taskTitle.textContent = inputValue;
  task.appendChild(taskTitle);

  leftItems();
  saveHistory();
});

todoFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const value = e.target.value;
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    if (value === "active") {
      if (task.classList.contains("completed")) {
        task.style.display = "none";
      } else {
        task.style.display = "block";
      }
    } else if (value === "completed") {
      if (task.classList.contains("completed")) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    } else if (value === "all") {
      task.style.display = "block";
    }
  });
  saveHistory();
});

const filterButtons = document.querySelectorAll(".todo_filter button");
let activeButton = null;

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (activeButton) {
      activeButton.classList.remove("active");
    }
    btn.classList.add("active");
    activeButton = btn;
  });
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const tasks = document.querySelectorAll(".task.completed");
  for (let task of tasks) {
    task.remove();
  }
  saveHistory();
  leftItems();
});

function saveHistory() {
  const tasksArr = [];
  document.querySelectorAll(".task").forEach((task) => {
    const text = task.querySelector(".task_title").textContent;
    const completed = task.classList.contains("completed");
    tasksArr.push({ text, completed });
  });
  localStorage.setItem("history", JSON.stringify(tasksArr));
}

function showHistory() {
  const savedTasks = localStorage.getItem("history");
  if (!savedTasks) {
    return;
  }
  const tasks = JSON.parse(savedTasks);
  input.innerHTML = "";

  tasks.forEach(({ text, completed }) => {
    const task = document.createElement("li");
    task.classList.add("task");
    if (completed) {
      task.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task_checkbox");
    checkbox.checked = completed;

    if (completed) {
      checkbox.dataset.completed = "false";
    } else {
      checkbox.dataset.completed = "true";
    }

    checkbox.addEventListener("change", (e) => {
      const parentNode = e.target.closest(".task");
      const taskTitle = parentNode.querySelector(".task_titleNotCompleted");
      taskTitle.classList.toggle("done");
      parentNode.classList.toggle("completed");

      if (e.target.dataset.completed === "true") {
        e.target.dataset.completed = "false";
      } else {
        e.target.dataset.completed = "true";
      }

      saveHistory();
      leftItems();
    });

    task.appendChild(checkbox);

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task_title");
    taskTitle.textContent = text;
    if (completed) {
      taskTitle.classList.add("done");
    }

    task.appendChild(taskTitle);
    input.appendChild(task);
  });

  leftItems();
}

function leftItems() {
  let count = 0;
document.querySelectorAll(".task").forEach(task => {
  if (!task.classList.contains("completed")) {
    count++;
  }
});

itemsLeft.textContent = `${count} items left`;

}
showHistory();
