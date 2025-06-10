document.addEventListener('DOMContentLoaded', () => {
  loadTallies();
  refreshGallery();
  showTab('tally');

  document.querySelectorAll('.tab-button').forEach(btn =>
    btn.addEventListener('click', () => showTab(btn.dataset.tab))
  );

  document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);
  document.getElementById('savePostBtn').addEventListener('click', savePhotoPost);
});

let currentUploadedPhoto = null;
const fishSpecies = [
  { name: 'Largemouth Bass', rig: 'Texas Rig, Wacky Rig', bait: 'Plastic worms, Jigs, Crankbaits' },
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
  { name: 'Bluegill', rig: 'Bobber Rig', bait: 'Crickets, Worms' },
  { name: 'Rock Bass', rig: 'Light Jig', bait: 'Minnows, Worms' },
  { name: 'White Bass', rig: 'Spinnerbait', bait: 'Shad Imitation' },
  { name: 'Channel Catfish', rig: 'Slip Sinker Rig', bait: 'Stinkbait, Chicken Liver' },
  { name: 'Flathead Catfish', rig: 'Live Bait Rig', bait: 'Live Bluegill' },
  { name: 'Blue Catfish', rig: 'Bottom Rig', bait: 'Cut Shad' },
  { name: 'Burbot', rig: 'Glow Jig', bait: 'Cut Bait, Worms' },
  { name: 'Bowfin', rig: 'Weedless Jig', bait: 'Live Bait, Frogs' },
  { name: 'Carp', rig: 'Hair Rig', bait: 'Sweetcorn, Dough Balls' }
];

function loadTallies() {
  const fishList = document.getElementById('fishList');
  fishList.innerHTML = '';
  let total = 0;
  fishSpecies.forEach((fish, i) => {
    let tally = +localStorage.getItem(`fish-${i}`) || 0;
    total += tally;
    let div = document.createElement('div');
    div.className = 'fish-item';
    div.innerHTML = `
      <strong>${fish.name}</strong><br>
      Rig: ${fish.rig} | Bait: ${fish.bait}<br>
      <button onclick="changeTally(${i}, -1)">-</button>
      <span>${tally}</span>
      <button onclick="changeTally(${i}, +1)">+</button>
    `;
    fishList.appendChild(div);
  });
  document.getElementById('grandTotal').textContent = total;
}

function changeTally(i, delta) {
  let n = +localStorage.getItem(`fish-${i}`) || 0;
  n = Math.max(0, n + delta);
  localStorage.setItem(`fish-${i}`, n);
  loadTallies();
}

function resetSeason() {
  fishSpecies.forEach((_, i) => localStorage.removeItem(`fish-${i}`));
  loadTallies();
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'memory') refreshGallery();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) { currentUploadedPhoto = null; return; }
  const reader = new FileReader();
  reader.onload = () => currentUploadedPhoto = reader.result;
  reader.readAsDataURL(file);
}

function savePhotoPost() {
  if (!currentUploadedPhoto) return alert('Select a photo first.');
  const caption = document.getElementById('photoCaption').value.trim() || 'No caption';
  const loc = document.getElementById('photoLocationInput').value.trim() || 'No location';
  let arr = JSON.parse(localStorage.getItem('photoPosts') || '[]');
  arr.push({ image: currentUploadedPhoto, caption, loc, timestamp: Date.now() });
  localStorage.setItem('photoPosts', JSON.stringify(arr));
  refreshGallery();
  document.getElementById('photoInput').value = '';
  document.getElementById('photoCaption').value = '';
  document.getElementById('photoLocationInput').value = '';
  currentUploadedPhoto = null;
}

function refreshGallery() {
  const gal = document.getElementById('photoGallery');
  gal.innerHTML = '';
  let arr = JSON.parse(localStorage.getItem('photoPosts') || '[]');
  arr.sort((a, b) => b.timestamp - a.timestamp);
  arr.forEach((p, i) => {
    const c = document.createElement('div');
    c.className = 'photo-container';
    c.innerHTML = `
      <img src="${p.image}" class="gallery-photo" />
      <div>${p.caption}</div>
      <div>${p.loc}</div>
      <button onclick="deletePost(${p.timestamp})">Delete</button>
    `;
    c.querySelector('img').addEventListener('click', e => e.target.classList.toggle('expanded-photo'));
    gal.appendChild(c);
  });
}

function deletePost(ts) {
  let arr = JSON.parse(localStorage.getItem('photoPosts') || '[]');
  arr = arr.filter(p => p.timestamp !== ts);
  localStorage.setItem('photoPosts', JSON.stringify(arr));
  refreshGallery();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
    .then(r => console.log('SW regd:', r.scope))
    .catch(console.error));
}
