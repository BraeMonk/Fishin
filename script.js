// ===== Service Worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW registered:', r.scope))
      .catch(console.error));
}

// ===== App Initialization =====
window.addEventListener('DOMContentLoaded', () => {
  initFishList();
  setupTabs();
  recalculateTotal();
  renderPhotoPosts();
});

// ===== Fish Tally =====
function initFishList() {
  const fishList = document.getElementById("fishList");
  if (!fishList) return console.error("fishList not found");
  const fishData = getFishData();
  fishList.innerHTML = '';
  fishData.forEach(({name, rig, bait}) => {
    const saved = localStorage.getItem(name) || 0;
    const item = document.createElement('div');
    item.className = 'fish-item';
    item.innerHTML = `
      <div onclick="toggleInfo('${name}')" style="font-weight:bold;cursor:pointer;">
        ${name}: <span id="${name}-count">${saved}</span>
      </div>
      <div class="tally-controls">
        <button onclick="adjustCount('${name}', -1)">-</button>
        <button onclick="adjustCount('${name}', +1)">+</button>
        <button onclick="toggleInfo('${name}')">Info</button>
        <div id="${name}-info" style="display:none;margin-top:5px;">
          <strong>Rig:</strong> ${rig}<br>
          <strong>Bait:</strong> ${bait}
        </div>
      </div>`;
    fishList.appendChild(item);
  });
}

function getFishData() {
  return [
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
    { name: 'Carp', rig: 'Hair Rig', bait: 'Sweetcorn, Dough Balls' },
    { name: 'Northern Sunfish', rig: 'Bobber Rig', bait: 'Worms, Insects' },
    { name: 'Muskellunge (Muskie)', rig: 'Large Crankbait Rig, Jig', bait: 'Large Minnows, Topwater Lures' },
    { name: 'Yellow Bullhead', rig: 'Slip Sinker Rig', bait: 'Worms, Cut Bait' },
    { name: 'White Perch (White Bass)', rig: 'Spinnerbait, Jig', bait: 'Minnows' },
    { name: 'Freshwater Drum', rig: 'Bottom Rig', bait: 'Worms, Small Fish' },
    { name: 'Rainbow Smelt', rig: 'Small Jig', bait: 'Small Minnows or Flies' },
    { name: 'Chain Pickerel', rig: 'Spinnerbait, Jig', bait: 'Minnows, Frogs' },

    // Additional Ontario species:
    { name: 'Cisco (Lake Herring)', rig: 'Jigging Spoon', bait: 'Minnows' },
    { name: 'Mooneye', rig: 'Fly Rig', bait: 'Small Insects, Flies' },
    { name: 'American Eel', rig: 'Bottom Rig', bait: 'Worms, Cut Bait' },
    { name: 'Longnose Gar', rig: 'Rope Lure', bait: 'Minnows, Live Bait' },
    { name: 'Round Goby', rig: 'Bottom Jig', bait: 'Worms, Soft Plastics' },
    { name: 'Spottail Shiner', rig: 'Micro Jig', bait: 'Bread, Small Insects' },
    { name: 'Golden Shiner', rig: 'Micro Hook Rig', bait: 'Dough Balls, Worms' }
  ];
}

function adjustCount(name, delta) {
  const span = document.getElementById(`${name}-count`);
  if (!span) return;
  let c = parseInt(span.textContent) + delta;
  c = Math.max(0, c);
  span.textContent = c;
  localStorage.setItem(name, c);
  recalculateTotal();
}

function toggleInfo(name) {
  const info = document.getElementById(`${name}-info`);
  if (info) {
    info.style.display = (info.style.display === 'block') ? 'none' : 'block';
  }
}

function recalculateTotal() {
  let total = 0;
  document.querySelectorAll('.fish-item span[id$="-count"]').forEach(sp => {
    total += parseInt(sp.textContent) || 0;
  });
  document.getElementById('grandTotal').textContent = total;
}

// ===== Tabs =====
function setupTabs() {
  const btns = document.querySelectorAll('.tab-button');
  const tabs = document.querySelectorAll('.tab-content');
  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));
      b.classList.add('active');
      document.getElementById(b.dataset.tab).classList.add('active');
    });
  });
}

// ===== Utilities =====
function readFile(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ===== IndexedDB =====
function getIndexedDBPosts() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('FishinBuddyDB', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos',{keyPath:'id',autoIncrement:true});
      }
    };
    req.onerror = () => rej('DB open error');
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('photos', 'readonly').objectStore('photos');
      const getAll = tx.getAll();
      getAll.onerror = () => rej('DB getAll error');
      getAll.onsuccess = () => res(getAll.result);
    };
  });
}

function saveToIndexedDB(photo) {
  return new Promise((res, rej) => {
    const req = indexedDB.open('FishinBuddyDB', 1);
    req.onerror = () => rej('DB open error');
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('photos','readwrite');
      const store = tx.objectStore('photos');
      const add = store.add(photo);
      add.onerror = () => rej('DB add error');
      add.onsuccess = () => res();
    };
  });
}

function deleteIndexedDBPostById(id) {
  return new Promise((res, rej) => {
    const req = indexedDB.open('FishinBuddyDB', 1);
    req.onerror = () => rej('DB open error');
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('photos', 'readwrite');
      const store = tx.objectStore('photos');
      const deleteReq = store.delete(id);
      deleteReq.onsuccess = () => res();
      deleteReq.onerror = () => rej('DB delete error');
    };
  });
}

// ===== Photo Gallery =====
async function renderPhotoPosts() {
  const gal = document.getElementById('photoGallery');
  gal.innerHTML = '';
  const posts = await getIndexedDBPosts().catch(() => []);
  posts.sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp));

  // Group posts by groupId
  const grouped = posts.reduce((acc, post) => {
    (acc[post.groupId] = acc[post.groupId] || []).push(post);
    return acc;
  }, {});

  // For each group, create a container
  Object.values(grouped).forEach(group => {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'photo-group';

    // Show caption & location from first photo in group
    const caption = group[0].caption || '';
    const location = group[0].location || '';

    const metaDiv = document.createElement('div');
    metaDiv.className = 'group-meta';
    metaDiv.textContent = `${caption} ${location ? '- ' + location : ''}`;
    groupContainer.appendChild(metaDiv);

    // Create photo containers inside group
    group.forEach((post, idx) => {
      const container = document.createElement('div');
      container.className = 'photo-container';

      const img = document.createElement('img');
      img.src = post.image;
      img.alt = post.caption || 'Photo';
      img.onclick = () => openModal(post.image);

      const meta = document.createElement('div');
      meta.className = 'photo-meta';
      meta.textContent = new Date(post.timestamp).toLocaleString();

      const btnRow = document.createElement('div');
      btnRow.className = 'photo-buttons';

      // Buttons for delete, share, etc.
      ['🗑️','📤','🎣'].forEach(icon => {
        const b = document.createElement('button');
        b.innerHTML = icon;
        b.onclick = () => {
          if (icon === '🗑️') {
            deleteIndexedDBPostById(post.id).then(renderPhotoPosts);
          }
          // TODO: Add share/catch functionality here
        };
        btnRow.appendChild(b);
      });

      container.append(img, meta, btnRow);
      groupContainer.appendChild(container);
    });

    gal.appendChild(groupContainer);
  });
}

async function handleUpload() {
  const input = document.getElementById('photoInput');
  const files = Array.from(input.files);
  if (files.length === 0) return;

  const caption = prompt("Enter a caption for these photos:", "");
  if (caption === null) return; // user cancelled

  const location = prompt("Enter a location for these photos:", "");
  if (location === null) return; // user cancelled

  // Create a groupId for this batch upload
  const groupId = Date.now().toString();

  for (let f of files) {
    const data = await readFile(f);
    const photo = {
      image: data,
      caption,
      location,
      timestamp: new Date().toISOString(),
      groupId
    };
    await saveToIndexedDB(photo);
  }
  input.value = '';
  renderPhotoPosts();
}

// ===== Modal =====
function openModal(src) {
  const modal = document.getElementById('imageModal');
  document.getElementById('modalImg').src = src;
  modal.style.display = 'flex';
}
document.getElementById('modalClose').onclick = () => {
  document.getElementById('imageModal').style.display = 'none';
};
