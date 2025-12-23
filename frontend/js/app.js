const loggedInUser = localStorage.getItem("username");

if (!loggedInUser) {
  window.location.href = "login.html";
}

const usernameLabel = document.getElementById("username-label");
if (usernameLabel) {
  usernameLabel.textContent = loggedInUser;
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });
}

const API_BASE = "http://127.0.0.1:5000/api/habits";

const habitList = document.querySelector(".habit-list");
const emptyState = document.getElementById("empty-state");

const addHabitBtn = document.getElementById("add-habit-btn");
const addHabitSection = document.getElementById("add-habit-section");
const habitInput = document.getElementById("habit-title-input");
const saveHabitBtn = document.getElementById("save-habit-btn");
const cancelHabitBtn = document.getElementById("cancel-habit-btn");

let editingHabitId = null;

function showAddHabit() {
  addHabitSection.classList.remove("hidden");
  habitInput.focus();
}

function hideAddHabit() {
  addHabitSection.classList.add("hidden");
  habitInput.value = "";
  editingHabitId = null;
}

function toggleEmptyState(show) {
  emptyState.classList.toggle("hidden", !show);
}

function renderHabit(habit) {
  const item = document.createElement("div");
  item.className = "habit-item";
  item.dataset.id = habit.id;

  const statusBtn = document.createElement("button");
  statusBtn.className = "habit-status";
  statusBtn.textContent = habit.done_today ? "✅" : "⭕";
  statusBtn.onclick = () => toggleDone(habit.id);

  const title = document.createElement("span");
  title.className = "habit-title";
  title.textContent = habit.title;

  const input = document.createElement("input");
  input.className = "habit-edit-input hidden";
  input.value = habit.title;

  title.onclick = () => {
    item.classList.add("editing");
    input.classList.remove("hidden");
    input.focus();
  };

  input.onkeydown = async (e) => {
    if (e.key === "Enter") {
      await updateHabit(habit.id, input.value);
      loadHabits();
    }
    if (e.key === "Escape") {
      item.classList.remove("editing");
      input.classList.add("hidden");
    }
  };

  input.onblur = () => {
    item.classList.remove("editing");
    input.classList.add("hidden");
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "habit-delete";
  deleteBtn.textContent = "🗑";
  deleteBtn.onclick = () => deleteHabit(habit.id);

  item.append(statusBtn, title, input, deleteBtn);
  habitList.appendChild(item);
}


function startEditHabit(habit) {
  editingHabitId = habit.id;
  habitInput.value = habit.title;
  addHabitSection.classList.remove("hidden");
  habitInput.focus();
}

async function loadHabits() {
  habitList.innerHTML = "";
  habitList.appendChild(emptyState);

  try {
    const res = await fetch(API_BASE);
    const habits = await res.json();

    if (habits.length === 0) {
      toggleEmptyState(true);
      return;
    }

    toggleEmptyState(false);
    habits.forEach(renderHabit);
  } catch (e) {}
}

async function addHabit() {
  const title = habitInput.value.trim();
  if (!title) return;

  try {
    if (editingHabitId) {
      await fetch(`${API_BASE}/${editingHabitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      editingHabitId = null;
    } else {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
    }

    hideAddHabit();
    loadHabits();
  } catch (e) {}
}

async function toggleDone(id) {
  try {
    await fetch(`${API_BASE}/${id}/done`, { method: "POST" });
    loadHabits();
  } catch (e) {}
}

async function deleteHabit(id) {
  try {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    loadHabits();
  } catch (e) {}
}

addHabitBtn.addEventListener("click", showAddHabit);
saveHabitBtn.addEventListener("click", addHabit);
cancelHabitBtn.addEventListener("click", hideAddHabit);

loadHabits();
