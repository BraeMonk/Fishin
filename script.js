document.addEventListener("DOMContentLoaded", () => {
  const speciesTab = document.getElementById("speciesContainer");
  const totalCatchDisplay = document.getElementById("totalCatch");

  const speciesData = [
    { icon: "🐟", name: "Yellow Perch", scientific: "Perca flavescens", count: 0 },
    { icon: "🐠", name: "Smallmouth Bass", scientific: "Micropterus dolomieu", count: 0 },
    { icon: "🎣", name: "Largemouth Bass", scientific: "Micropterus salmoides", count: 0 },
    { icon: "🦈", name: "Northern Pike", scientific: "Esox lucius", count: 0 },
    { icon: "🐡", name: "Lake Trout", scientific: "Salvelinus namaycush", count: 0 },
    { icon: "🛡️", name: "Lake Whitefish", scientific: "Coregonus clupeaformis", count: 0 },
    { icon: "❄️", name: "Burbot (Ling Cod)", scientific: "Lota lota", count: 0 },
    { icon: "💧", name: "Lake Herring (Cisco)", scientific: "Coregonus artedi", count: 0 },
    { icon: "🌀", name: "Walleye", scientific: "Sander vitreus", count: 0 },
    { icon: "🪨", name: "Black Crappie", scientific: "Pomoxis nigromaculatus", count: 0 },
    { icon: "⚡", name: "Muskellunge", scientific: "Esox masquinongy", count: 0 }
  ];

  // Load saved tallies
  const saved = JSON.parse(localStorage.getItem("fishCounts") || "{}");
  speciesData.forEach(s => { if (saved[s.name] !== undefined) s.count = saved[s.name]; });

  function renderSpecies() {
    speciesTab.innerHTML = "";
    speciesData.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "species-card";
      card.innerHTML = `
        <div class="species-header">
          <div class="species-info">
            <div class="species-icon">${s.icon}</div>
            <div class="species-name">
              <h3>${s.name}</h3>
              <div class="scientific">${s.scientific}</div>
            </div>
          </div>
          <div class="counter-controls">
            <button class="counter-btn minus" data-index="${i}">−</button>
            <div class="count-display" id="count-${i}">${s.count}</div>
            <button class="counter-btn plus" data-index="${i}">+</button>
          </div>
        </div>
      `;
      speciesTab.appendChild(card);
    });
    updateTotal();
  }

  function updateTotal() {
    const total = speciesData.reduce((sum, s) => sum + s.count, 0);
    totalCatchDisplay.textContent = total;
  }

  function save() {
    const obj = {};
    speciesData.forEach(s => (obj[s.name] = s.count));
    localStorage.setItem("fishCounts", JSON.stringify(obj));
  }

  // Button logic
  speciesTab.addEventListener("click", e => {
    if (e.target.classList.contains("counter-btn")) {
      const i = parseInt(e.target.dataset.index);
      speciesData[i].count += e.target.classList.contains("plus") ? 1 : -1;
      speciesData[i].count = Math.max(0, speciesData[i].count);
      document.getElementById(`count-${i}`).textContent = speciesData[i].count;
      updateTotal();
      save();
    }
  });

  // Reset button
  document.getElementById("resetSeasonBtn").addEventListener("click", () => {
    if (confirm("Reset all tallies for the season?")) {
      speciesData.forEach(s => s.count = 0);
      localStorage.removeItem("fishCounts");
      renderSpecies();
    }
  });

  // Navigation (preserve your earlier logic)
  window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
  };

  renderSpecies();
});
