const speciesData = [
    {
        icon: "🐟",
        name: "Yellow Perch",
        scientific: "Perca flavescens",
        count: 0
    },
    {
        icon: "🐠",
        name: "Smallmouth Bass",
        scientific: "Micropterus dolomieu",
        count: 0
    },
    {
        icon: "🦈",
        name: "Northern Pike",
        scientific: "Esox lucius",
        count: 0
    },
    {
        icon: "🎣",
        name: "Largemouth Bass",
        scientific: "Micropterus salmoides",
        count: 0
    }
];

function renderSpecies() {
    const speciesTab = document.getElementById('species-tab');
    speciesTab.innerHTML = ''; // Clear existing content

    speciesData.forEach((species, index) => {
        const card = document.createElement('div');
        card.className = 'species-card';
        card.innerHTML = `
            <div class="species-header">
                <div class="species-info">
                    <div class="species-icon">${species.icon}</div>
                    <div class="species-name">
                        <h3>${species.name}</h3>
                        <div class="scientific">${species.scientific}</div>
                    </div>
                </div>
                <div class="counter-controls">
                    <button class="counter-btn minus" onclick="updateCount(${index}, -1)">-</button>
                    <div class="count-display" id="count-${index}">${species.count}</div>
                    <button class="counter-btn plus" onclick="updateCount(${index}, 1)">+</button>
                </div>
            </div>
        `;
        speciesTab.appendChild(card);
    });

    updateTotalCatch();
}

function updateCount(index, change) {
    speciesData[index].count = Math.max(0, speciesData[index].count + change);
    document.getElementById(`count-${index}`).innerText = speciesData[index].count;
    updateTotalCatch();
}

function updateTotalCatch() {
    const total = speciesData.reduce((acc, species) => acc + species.count, 0);
    document.getElementById('totalCatch').innerText = total;
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    document.getElementById(`${tab}-tab`).classList.add('active');
    document.querySelector(`.nav-tab[onclick="showTab('${tab}')"]`).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
    renderSpecies();
});
