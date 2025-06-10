document.addEventListener('DOMContentLoaded', () => {
  loadTallies();
  loadPhotos();

  document.getElementById('photoInput').addEventListener('change', uploadPhoto);
});

// Fish species list
const fishSpecies = [
  { name: 'Largemouth Bass', rig: 'Texas Rig', bait: 'Plastic Worm' },
  { name: 'Smallmouth Bass', rig: 'Drop Shot', bait: 'Minnow' },
  { name: 'Northern Pike', rig: 'Spinner Rig', bait: 'Crankbait' },
  { name: 'Walleye', rig: 'Jig Head', bait: 'Nightcrawler' },
  { name: 'Yellow Perch', rig: 'Slip Bobber', bait: 'Minnows' },
  { name: 'Rainbow Trout', rig: 'Fly Rig', bait: 'Dry Fly' },
  { name: 'Brook Trout', rig: 'Inline Spinner', bait: 'Salmon Eggs' },
  { name: 'Lake Trout', rig: 'Downrigger', bait: 'Spoon' },
  { name: 'Brown Trout', rig: 'Drift Rig', bait: 'Worm' },
  { name: 'Black Crappie', rig: 'Light Jig', bait: 'Small Minnow' },
  { name: 'White Crappie', rig: 'Micro Jig', bait: 'Grubs' },
  { name: 'Pumpkinseed Sunfish', rig: 'Bobber Rig', bait: 'Worms' },
  { name: 'Bluegill', rig: 'Split Shot Rig', bait: 'Waxworm' },
  { name: 'Catfish', rig: 'Slip Sinker Rig', bait: 'Cut Bait' },
  { name: 'Muskellunge', rig: 'Glide Bait Rig', bait: 'Bucktail Spinner' },
  { name: 'White Bass', rig: 'Casting Jig', bait: 'Blade Bait' },
  { name: 'Rock Bass', rig: 'Finesse Rig', bait: 'Soft Plastics' },
  { name: 'Sturgeon', rig: 'Heavy Bottom Rig', bait: 'Stink Bait' },
  { name: 'Cisco', rig: 'Trolling Rig', bait: 'Spinners' },
  { name: 'Burbot', rig: 'Deep Jigging', bait: 'Cut Minnows' }
];

// --- Tally logic ---

function loadTallies() {
  const fishList = document.getElementById('fishList');
  fishList.innerHTML = '';
  let seasonTotal = 0;

  fishSpecies.forEach((fish, idx) => {
    const tally = parseInt(localStorage.getItem(`fish-${idx}`) || '0', 10);
    seasonTotal += tally;

    const fishItem = document.createElement('div');
    fishItem.className = 'fish-item';
    fishItem.innerHTML = `
      <button onclick="toggleFishDetails(${idx})" class="fish-name">${fish.name}</button>
      <div id="fish-${idx}-details" class="fish-details" style="display:none;">
        <p><strong>Rig:</strong> ${fish.rig}</p>
        <p><strong>Bait:</strong> ${fish.bait}</p>
      </div>
      <div class="tally-controls">
        <span class="tally-count">${tally}</span>
        <button onclick="increaseTally(${idx})">+</button>
        <button onclick="decreaseTally(${idx})">-</button>
      </div>
    `;
    fishList.appendChild(fishItem);
  });

  document.getElementById('grandTotal').textContent = seasonTotal;
}

function increaseTally(index) {
  let tally = parseInt(localStorage.getItem(`fish-${index}`) || '0', 10);
  tally++;
  localStorage.setItem(`fish-${index}`, tally);
  loadTallies();
}

function decreaseTally(index) {
  let tally = parseInt(localStorage.getItem(`fish-${index}`) || '0', 10);
  if (tally > 0) tally--;
  localStorage.setItem(`fish-${index}`, tally);
  loadTallies();
}

function toggleFishDetails(index) {
  const details = document.getElementById(`fish-${index}-details`);
  details.style.display = details.style.display === 'block' ? 'none' : 'block';
}

function resetSeason() {
  fishSpecies.forEach((_, idx) => localStorage.removeItem(`fish-${idx}`));
  loadTallies();
}

// --- Tabs ---

function showTab(tabName) {
  document.getElementById('tallyTab').style.display = (tabName === 'tally') ? 'block' : 'none';
  document.getElementById('memoriesTab').style.display = (tabName === 'memories') ? 'block' : 'none';
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// --- Photos ---

function uploadPhoto(event) {
  const captionInput = document.getElementById('photoCaption');
  const locationInput = document.getElementById('photoLocationInput');
  const userLocation = locationInput.value.trim();

  if (!event.target.files[0]) return;

  const reader = new FileReader();
  reader.onload = () => {
    const photoData = {
      id: generateId(),
      src: reader.result,
      caption: captionInput.value.trim() || '(No caption)',
      date: new Date().toLocaleString(),
      location: userLocation || null  // use user input if provided
    };

    // If no user location, try to get GPS location
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        photoData.location = `Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)}`;
        savePhoto(photoData);
      }, () => {
        // GPS permission denied or error, save without GPS location
        savePhoto(photoData);
      });
    } else {
      // user provided location or no GPS support
      savePhoto(photoData);
    }

    captionInput.value = ''; // clear inputs after upload
    locationInput.value = '';
    event.target.value = '';
  };
  reader.readAsDataURL(event.target.files[0]);
}

function savePhoto(photo) {
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  photos.unshift(photo); // Newest first
  localStorage.setItem('photos', JSON.stringify(photos));
  loadPhotos();
}

function loadPhotos() {
  const gallery = document.getElementById('photoGallery');
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  gallery.innerHTML = '';

  photos.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'photo-container';
    div.innerHTML = `
      <img src="${photo.src}" class="photo-thumb" onclick="openModal('${photo.id}')" alt="Photo" />
      <div class="photo-caption">${escapeHtml(photo.caption)}</div>
      <div class="photo-date">${photo.date}</div>
      <div class="photo-location">${photo.location || '(Location not specified)'}</div>
      <button onclick="deletePhoto('${photo.id}')">Delete</button>
    `;
    gallery.appendChild(div);
  });
}

function deletePhoto(photoId) {
  let photos = JSON.parse(localStorage.getItem('photos') || '[]');
  photos = photos.filter(p => p.id !== photoId);
  localStorage.setItem('photos', JSON.stringify(photos));
  loadPhotos();
}

function openModal(photoId) {
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  const photo = photos.find(p => p.id === photoId);
  if (!photo) return;

  const modal = document.getElementById('photoModal');
  modal.querySelector('img').src = photo.src;
  modal.querySelector('.modal-caption').textContent = photo.caption;
  modal.querySelector('.modal-date').textContent = photo.date;
  modal.querySelector('.modal-location').textContent = photo.location || '(Location not specified)';
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('photoModal').style.display = 'none';
}

// Utility: Simple ID generator for photos
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Utility: Escape HTML to avoid injection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
// --- Service Worker Registration ---

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
