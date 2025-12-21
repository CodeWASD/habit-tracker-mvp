const API_BASE = "http://127.0.0.1:5000/api/habits";

const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-title");
const habitList = document.getElementById("habit-list");

document.addEventListener("DOMContentLoaded", loadHabits);

function loadHabits() {
  fetch(API_BASE)
    .then(res => res.json())
    .then(data => {
      habitList.innerHTML = "";
      data.forEach(renderHabit);
    });
}

function renderHabit(habit) {
  const li = document.createElement("li");
  li.textContent = habit.title;

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.onclick = () => markDone(habit.id);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.onclick = () => deleteHabit(habit.id);

  li.append(doneBtn, delBtn);
  habitList.appendChild(li);
}

habitForm.addEventListener("submit", e => {
  e.preventDefault();

  fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: habitInput.value })
  }).then(() => {
    habitInput.value = "";
    loadHabits();
  });
});

function markDone(id) {
  fetch(`${API_BASE}/${id}/done`, { method: "POST" })
    .then(loadHabits);
}

function deleteHabit(id) {
  fetch(`${API_BASE}/${id}`, { method: "DELETE" })
    .then(loadHabits);
}
