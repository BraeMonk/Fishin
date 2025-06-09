const speciesList = [
  "Largemouth Bass", "Smallmouth Bass", "Northern Pike", "Muskellunge",
  "Walleye", "Yellow Perch", "Rock Bass", "Pumpkinseed", "Bluegill",
  "Crappie", "Bowfin", "Brown Bullhead", "Channel Catfish", "Carp",
  "White Sucker", "Lake Trout", "Rainbow Trout", "Brown Trout",
  "Brook Trout", "Cisco", "Lake Whitefish", "Burbot", "Splake",
  "Round Goby", "White Perch", "Mooneye", "Alewife", "American Eel"
];

let catchData = JSON.parse(localStorage.getItem("catchData")) || {};
let totalCatch = 0;

function updateTotalCatch() {
  totalCatch = Object.values(catchData).reduce((sum, count) => sum + count, 0);
  document.getElementById("totalCatch").textContent = totalCatch;
}

function saveData() {
  localStorage.setItem("catchData", JSON.stringify(catchData));
}

function createSpeciesCard(species) {
  const card = document.createElement("div");
  card.className = "species-card";

  const title = document.createElement("h3");
  title.textContent = species;

  const count = document.createElement("p");
  count.id = `count-${species}`;
  count.textContent = catchData[species] || 0;

  const controls = document.createElement("div");
  controls.className = "counter-controls";

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "-";
  minusBtn.className = "counter-btn";
  minusBtn.onclick = () => adjustCount(species, -1);

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  plusBtn.className = "counter-btn";
  plusBtn.onclick = () => adjustCount(species, 1);

  controls.appendChild(minusBtn);
  controls.appendChild(plusBtn);

  card.appendChild(title);
  card.appendChild(count);
  card.appendChild(controls);

  return card;
}

function adjustCount(species, amount) {
  if (!catchData[species]) catchData[species] = 0;
  catchData[species] += amount;
  if (catchData[species] < 0) catchData[species] = 0;
  document.getElementById(`count-${species}`).textContent = catchData[species];
  saveData();
  updateTotalCatch();
}

function initSpeciesCards() {
  const container = document.getElementById("speciesContainer");
  speciesList.forEach(species => {
    const card = createSpeciesCard(species);
    container.appendChild(card);
  });
  updateTotalCatch();
}

// Reset season
document.getElementById("resetSeasonBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset the season?")) {
    catchData = {};
    localStorage.removeItem("catchData");
    document.getElementById("speciesContainer").innerHTML = "";
    initSpeciesCards();
  }
});

// Tab switching
function showTab(tabId) {
  document.querySelectorAll(".tab-section").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// Load saved photos
function loadPhotos() {
  const savedPhotos = JSON.parse(localStorage.getItem("memoryPhotos")) || [];
  const album = document.getElementById("photo-album");
  savedPhotos.forEach(base64 => {
    const img = document.createElement("img");
    img.src = base64;
    album.appendChild(img);
  });
}

function handlePhotoUpload(event) {
  const files = event.target.files;
  const album = document.getElementById("photo-album");
  let savedPhotos = JSON.parse(localStorage.getItem("memoryPhotos")) || [];

  [...files].forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      const img = document.createElement("img");
      img.src = base64;
      album.appendChild(img);
      savedPhotos.push(base64);
      localStorage.setItem("memoryPhotos", JSON.stringify(savedPhotos));
    };
    reader.readAsDataURL(file);
  });
}

window.onload = () => {
  initSpeciesCards();
  loadPhotos();
  showTab("tallyTab");
};
