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

function showAddHabit() {
  addHabitSection.classList.remove("hidden");
  habitInput.focus();
}

function hideAddHabit() {
  addHabitSection.classList.add("hidden");
  habitInput.value = "";
}

function toggleEmptyState(show) {
  emptyState.classList.toggle("hidden", !show);
}

function renderHabit(habit) {
  const item = document.createElement("div");
  item.className = "habit-item";

  const statusBtn = document.createElement("button");
  statusBtn.className = "habit-status";
  statusBtn.textContent = habit.done_today ? "✅" : "⭕";
  statusBtn.addEventListener("click", () => toggleDone(habit.id));

  const title = document.createElement("span");
  title.className = "habit-title";
  title.textContent = habit.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "habit-delete";
  deleteBtn.textContent = "🗑";
  deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

  item.append(statusBtn, title, deleteBtn);
  habitList.appendChild(item);
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
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

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
