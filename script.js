// script.js - handles tab switching, species rendering, and tallying
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');
    document.querySelector('[onclick="showTab(\'' + tabId + '\')"]').classList.add('active');
}

// Example species data
const speciesData = [
    { name: "Perch", scientific: "Perca flavescens", count: 0 },
    { name: "Smallmouth Bass", scientific: "Micropterus dolomieu", count: 0 }
];

function updateTotalCatch() {
    const total = speciesData.reduce((sum, fish) => sum + fish.count, 0);
    document.getElementById('totalCatch').textContent = total;
}

function renderSpecies() {
    const container = document.getElementById("species-tab");
    container.innerHTML = '';
    speciesData.forEach((fish, index) => {
        const card = document.createElement('div');
        card.className = 'species-card';
        card.innerHTML = \`
            <div class="species-header">
                <div class="species-info">
                    <div class="species-icon">🐟</div>
                    <div class="species-name">
                        <h3>\${fish.name}</h3>
                        <div class="scientific">\${fish.scientific}</div>
                    </div>
                </div>
                <div class="counter-controls">
                    <button class="counter-btn minus" onclick="changeCount(\${index}, -1)">−</button>
                    <div class="count-display" id="count-\${index}">\${fish.count}</div>
                    <button class="counter-btn plus" onclick="changeCount(\${index}, 1)">+</button>
                </div>
            </div>
        \`;
        container.appendChild(card);
    });
}

function changeCount(index, delta) {
    speciesData[index].count = Math.max(0, speciesData[index].count + delta);
    document.getElementById('count-' + index).textContent = speciesData[index].count;
    updateTotalCatch();
}

document.addEventListener("DOMContentLoaded", () => {
    renderSpecies();
    updateTotalCatch();
});
