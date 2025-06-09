document.addEventListener('DOMContentLoaded', () => {
  const speciesList = [
    { icon: '🐟', name: 'Yellow Perch' },
    { icon: '🐠', name: 'Lake Trout' },
    { icon: '❄️', name: 'Lake Whitefish' },
    { icon: '🐡', name: 'Burbot' },
    { icon: '💧', name: 'Lake Herring' },
    { icon: '🦈', name: 'Northern Pike' },
    { icon: '🎣', name: 'Smallmouth Bass' },
    { icon: '🛶', name: 'Largemouth Bass' },
    { icon: '🌀', name: 'Walleye' },
    { icon: '🪨', name: 'Black Crappie' },
    { icon: '⚡', name: 'Muskellunge' },
    { icon: '👁️', name: 'Rock Bass' },
    { icon: '🥁', name: 'Freshwater Drum' }
  ];

  const container = document.getElementById('speciesContainer');
  const totalDisplay = document.getElementById('totalCatch');

  // Render species cards with counters
  speciesList.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.innerHTML = `
      <div class="species-header">
        <div class="species-info">
          <div class="species-icon">${s.icon}</div>
          <div class="species-name">
            <h3>${s.name}</h3>
          </div>
        </div>
        <div class="counter-controls">
          <button class="counter-btn minus" data-index="${i}">−</button>
          <div id="count-${i}" class="count-display">0</div>
          <button class="counter-btn plus" data-index="${i}">+</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Load saved counts
  speciesList.forEach((s, i) => {
    const saved = localStorage.getItem(`tally-${s.name}`) || 0;
    s.count = parseInt(saved, 10);
    document.getElementById(`count-${i}`).textContent = s.count;
  });

  updateTotal();

  // Event delegation for counter buttons
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('counter-btn')) {
      const idx = parseInt(e.target.getAttribute('data-index'));
      const species = speciesList[idx];
      if (e.target.classList.contains('plus')) species.count++;
      else species.count = Math.max(0, species.count - 1);

      document.getElementById(`count-${idx}`).textContent = species.count;
      localStorage.setItem(`tally-${species.name}`, species.count);
      updateTotal();
    }
  });

  // Reset button logic
  document.getElementById('resetSeasonBtn').addEventListener('click', () => {
    if (confirm('Reset all tallies for the season?')) {
      speciesList.forEach((s, i) => {
        s.count = 0;
        localStorage.removeItem(`tally-${s.name}`);
        document.getElementById(`count-${i}`).textContent = '0';
      });
      updateTotal();
    }
  });

  function updateTotal() {
    const total = speciesList.reduce((sum, s) => sum + s.count, 0);
    totalDisplay.textContent = total;
  }

  // Photo album from notes
  loadPhotoAlbum();
});

// ---- NOTES SECTION ----
function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  const album = document.getElementById('photo-album');
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result;
      const photos = JSON.parse(localStorage.getItem('memories-photos') || '[]');
      photos.push(imgData);
      localStorage.setItem('memories-photos', JSON.stringify(photos));
      const img = document.createElement('img');
      img.src = imgData;
      album.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function loadPhotoAlbum() {
  const files = JSON.parse(localStorage.getItem('memories-photos') || '[]');
  const album = document.getElementById('photo-album');
  files.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    album.appendChild(img);
  });
}
