document.addEventListener('DOMContentLoaded', () => {
  loadTallies();
  refreshGallery();
  showTab('tally');

  // When user selects a photo, read it and store temporarily
  document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);

  // Save button triggers saving the photo post to localStorage
  document.getElementById('savePostBtn').addEventListener('click', savePhotoPost);
});

// Temporary storage for uploaded photo data URL before saving
let currentUploadedPhoto = null;

// --- Fish Species Data ---
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

// --- Tally Logic ---
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
  const activeBtn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (tabName === 'tally') loadTallies();
  if (tabName === 'memories') refreshGallery();
}

// --- Photo Upload Logic ---

// When user selects a photo, read file and store it temporarily
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    currentUploadedPhoto = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    currentUploadedPhoto = e.target.result;
  };
  reader.readAsDataURL(file);
}

// When user clicks Save Post button, save currentUploadedPhoto with caption and location
function savePhotoPost() {
  if (!currentUploadedPhoto) {
    alert("Please select a photo first.");
    return;
  }

  const caption = document.getElementById('photoCaption').value.trim() || "No caption";
  const location = document.getElementById('photoLocationInput').value.trim() || "No location";

  const newPost = {
    image: currentUploadedPhoto,
    caption,
    location,
    timestamp: Date.now()
  };

  let savedPosts = JSON.parse(localStorage.getItem('photoPosts')) || [];
  savedPosts.push(newPost);
  localStorage.setItem('photoPosts', JSON.stringify(savedPosts));

  refreshGallery();

  // Clear inputs and reset
  document.getElementById('photoInput').value = '';
  document.getElementById('photoCaption').value = '';
  document.getElementById('photoLocationInput').value = '';
  currentUploadedPhoto = null;
}

// --- Gallery Logic ---
function refreshGallery() {
  const gallery = document.getElementById('photoGallery');
  gallery.innerHTML = '';

  let savedPosts = JSON.parse(localStorage.getItem('photoPosts')) || [];
  savedPosts.sort((a, b) => b.timestamp - a.timestamp); // newest first

  savedPosts.forEach(post => addPostToGallery(post));
}

function addPostToGallery(post) {
  const gallery = document.getElementById('photoGallery');
  const container = document.createElement('div');
  container.className = 'photo-container';
  container.setAttribute('data-timestamp', post.timestamp);

  const img = document.createElement('img');
  img.src = post.image;

  const captionEl = document.createElement('div');
  captionEl.textContent = post.caption;

  const locationEl = document.createElement('div');
  locationEl.textContent = post.location;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = function () {
    deletePost(post.timestamp);
  };

  container.appendChild(img);
  container.appendChild(captionEl);
  container.appendChild(locationEl);
  container.appendChild(deleteBtn);

  gallery.appendChild(container);
}

function deletePost(timestamp) {
  let savedPosts = JSON.parse(localStorage.getItem('photoPosts')) || [];
  savedPosts = savedPosts.filter(post => post.timestamp !== timestamp);
  localStorage.setItem('photoPosts', JSON.stringify(savedPosts));
  refreshGallery();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
