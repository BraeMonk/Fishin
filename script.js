document.addEventListener("DOMContentLoaded", () => {
    const speciesTab = document.getElementById("species-tab");
    const totalCatchDisplay = document.getElementById("totalCatch");

    const speciesData = [
        { icon: "🐟", name: "Yellow Perch", scientific: "Perca flavescens", count: 0 },
        { icon: "🐠", name: "Smallmouth Bass", scientific: "Micropterus dolomieu", count: 0 },
        { icon: "🦈", name: "Northern Pike", scientific: "Esox lucius", count: 0 },
        { icon: "🎣", name: "Largemouth Bass", scientific: "Micropterus salmoides", count: 0 }
    ];

    // Load saved tallies from localStorage
    const savedCounts = JSON.parse(localStorage.getItem("fishCounts") || "{}");
    speciesData.forEach(species => {
        if (savedCounts[species.name] !== undefined) {
            species.count = savedCounts[species.name];
        }
    });

    // Render species list
    function renderSpecies() {
        speciesTab.innerHTML = "";
        speciesData.forEach((species, index) => {
            const speciesCard = document.createElement("div");
            speciesCard.className = "species-card";
            speciesCard.innerHTML = `
                <div class="species-header">
                    <div class="species-info">
                        <div class="species-icon">${species.icon}</div>
                        <div class="species-name">
                            <h3>${species.name}</h3>
                            <div class="scientific">${species.scientific}</div>
                        </div>
                    </div>
                    <div class="counter-controls">
                        <button class="counter-btn minus" data-index="${index}">−</button>
                        <div class="count-display" id="count-${index}">${species.count}</div>
                        <button class="counter-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            speciesTab.appendChild(speciesCard);
        });

        updateTotalCatch();
    }

    function updateTotalCatch() {
        const total = speciesData.reduce((sum, species) => sum + species.count, 0);
        totalCatchDisplay.textContent = total;
    }

    function saveCounts() {
        const counts = {};
        speciesData.forEach(species => {
            counts[species.name] = species.count;
        });
        localStorage.setItem("fishCounts", JSON.stringify(counts));
    }

    // Handle + / - button clicks
    speciesTab.addEventListener("click", e => {
        if (e.target.classList.contains("counter-btn")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            const isPlus = e.target.classList.contains("plus");
            if (isPlus) {
                speciesData[index].count++;
            } else {
                speciesData[index].count = Math.max(0, speciesData[index].count - 1);
            }
            document.getElementById(`count-${index}`).textContent = speciesData[index].count;
            updateTotalCatch();
            saveCounts();
        }
    });

    // Navigation tabs
    window.showTab = function(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
    };

    renderSpecies();
});
