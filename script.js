
const speciesList = [
  {
    name: "Largemouth Bass",
    scientific: "Micropterus salmoides",
    icon: "🐟",
    rigs: ["Texas Rig", "Wacky Rig", "Drop Shot"],
    baits: ["Soft plastic worms", "Topwater frogs", "Jigs"],
  },
  {
    name: "Yellow Perch",
    scientific: "Perca flavescens",
    icon: "🐠",
    rigs: ["Drop Shot", "Slip Bobber"],
    baits: ["Live worms", "Minnows", "Small jigs"],
  },
  {
    name: "Northern Pike",
    scientific: "Esox lucius",
    icon: "🦈",
    rigs: ["Wire Leader + Spinnerbait", "Jerkbait Rig"],
    baits: ["Large spoons", "Swimbaits", "Dead bait"],
  },
  {
    name: "Smallmouth Bass",
    scientific: "Micropterus dolomieu",
    icon: "🐡",
    rigs: ["Drop Shot", "Ned Rig"],
    baits: ["Crayfish imitations", "Jerkbaits", "Tubes"],
  },
  {
    name: "Walleye",
    scientific: "Sander vitreus",
    icon: "🦑",
    rigs: ["Jigging Rig", "Bottom Bouncer"],
    baits: ["Nightcrawlers", "Minnows", "Leeches"],
  },
  {
    name: "Crappie",
    scientific: "Pomoxis",
    icon: "🎏",
    rigs: ["Minnow Rig", "Slip Bobber"],
    baits: ["Minnows", "Small jigs", "Wax worms"],
  }
];

let catchData = JSON.parse(localStorage.getItem("catchData")) || {};

function saveCatchData() {
  localStorage.setItem("catchData", JSON.stringify(catchData));
}

function updateTotalCatch() {
  const total = Object.values(catchData).reduce((a, b) => a + b, 0);
  const totalEl = document.getElementById("totalCatch");
  if (totalEl) totalEl.textContent = total;
}

function toggleSpeciesDetails(index) {
  const details = document.getElementById(`details-${index}`);
  if (details.classList.contains("expanded")) {
    details.classList.remove("expanded");
    details.style.display = "none";
  } else {
    details.classList.add("expanded");
    details.style.display = "block";
  }
}

function renderSpecies() {
  const container = document.getElementById("species-tab");
  if (!container) return;
  container.innerHTML = "";

  speciesList.forEach((species, index) => {
    const count = catchData[species.name] || 0;

    const card = document.createElement("div");
    card.className = "species-card";

    const header = document.createElement("div");
    header.className = "species-header";
    header.onclick = () => toggleSpeciesDetails(index);

    const info = document.createElement("div");
    info.className = "species-info";
    info.innerHTML = `
      <div class="species-icon">${species.icon}</div>
      <div class="species-name">
        <h3>${species.name}</h3>
        <div class="scientific">${species.scientific}</div>
      </div>`;

    const controls = document.createElement("div");
    controls.className = "counter-controls";
    controls.innerHTML = `
      <button class="counter-btn minus" onclick="changeCount('${species.name}', -1); event.stopPropagation();">−</button>
      <div class="count-display" id="count-${species.name}">${count}</div>
      <button class="counter-btn plus" onclick="changeCount('${species.name}', 1); event.stopPropagation();">+</button>
    `;

    header.appendChild(info);
    header.appendChild(controls);

    const details = document.createElement("div");
    details.className = "species-details";
    details.id = `details-${index}`;
    details.style.display = "none";
    details.innerHTML = `
      <div class="detail-item">
        <div class="detail-label">🎣 Suggested Rigs:</div>
        <div class="detail-text">${species.rigs.join(", ")}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">🪱 Best Baits:</div>
        <div class="detail-text">${species.baits.join(", ")}</div>
      </div>
    `;

    card.appendChild(header);
    card.appendChild(details);
    container.appendChild(card);
  });
}

function changeCount(species, delta) {
  catchData[species] = (catchData[species] || 0) + delta;
  if (catchData[species] < 0) catchData[species] = 0;
  document.getElementById(`count-${species}`).textContent = catchData[species];
  updateTotalCatch();
  saveCatchData();
}

function resetCatchData() {
  catchData = {};
  saveCatchData();
  renderSpecies();
  updateTotalCatch();
}

document.addEventListener("DOMContentLoaded", () => {
  renderSpecies();
  updateTotalCatch();
  const resetButton = document.getElementById("resetButton");
  if (resetButton) resetButton.addEventListener("click", resetCatchData);
});
