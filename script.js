// HabitBloom - visualize habits as growing plants
// Simple, learner-friendly JavaScript with small helper functions.

const STORAGE_KEY = "habitbloom_habits_v1";

const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");
const garden = document.getElementById("garden");

let habits = [];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      habits = parsed;
    }
  } catch {
    habits = [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function addHabit(name) {
  const newHabit = {
    id: Date.now().toString(),
    name: name.trim(),
    streak: 0,
    lastCompleted: null,
  };
  habits.push(newHabit);
  saveHabits();
  render();
}

function deleteHabit(id) {
  habits = habits.filter((habit) => habit.id !== id);
  saveHabits();
  render();
}

function completeHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;

  const today = todayKey();
  if (habit.lastCompleted === today) {
    alert("Already completed today! Great job—come back tomorrow.");
    return;
  }

  habit.streak += 1;
  habit.lastCompleted = today;
  saveHabits();
  render();
}

function createHabitItem(habit) {
  const li = document.createElement("li");
  li.className = "habit-item";

  const info = document.createElement("div");
  info.className = "habit-info";

  const title = document.createElement("strong");
  title.textContent = habit.name;

  const details = document.createElement("span");
  details.textContent = `Streak: ${habit.streak} • Last completed: ${
    habit.lastCompleted || "never"
  }`;

  info.appendChild(title);
  info.appendChild(details);

  const actions = document.createElement("div");
  actions.className = "habit-actions";

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.className = "btn-complete";
  completeBtn.textContent = "Complete";
  completeBtn.addEventListener("click", () => completeHabit(habit.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(info);
  li.appendChild(actions);

  return li;
}

function createPlantCard(habit) {
  const card = document.createElement("div");
  card.className = "plant-card";

  const stage = document.createElement("div");
  stage.className = "plant-stage";

  const plant = document.createElement("div");
  plant.className = "plant";
  const growth = Math.min(habit.streak / 10, 1);
  plant.style.setProperty("--growth", growth.toString());

  const soil = document.createElement("div");
  soil.className = "soil";

  stage.appendChild(plant);
  stage.appendChild(soil);

  const label = document.createElement("div");
  label.className = "plant-label";
  label.textContent = habit.name;

  const streak = document.createElement("div");
  streak.className = "plant-streak";
  streak.textContent = `${habit.streak} day streak`;

  card.appendChild(stage);
  card.appendChild(label);
  card.appendChild(streak);

  return card;
}

function render() {
  habitList.innerHTML = "";
  garden.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML =
      '<li class="habit-item"><div class="habit-info"><strong>No habits yet</strong><span>Add one above to begin growing.</span></div></li>';
    return;
  }

  habits.forEach((habit) => {
    habitList.appendChild(createHabitItem(habit));
    garden.appendChild(createPlantCard(habit));
  });
}

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;
  addHabit(name);
  habitInput.value = "";
  habitInput.focus();
});

loadHabits();
render();


