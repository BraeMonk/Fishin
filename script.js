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

/// ===== Photo Gallery =====

// Handle photo upload
function handleUpload() {
  const input = document.getElementById("photoInput");
  const files = input.files;
  if (!files.length) return;

  const storedPhotos = JSON.parse(localStorage.getItem("photos")) || [];

  // We'll process each file one by one and prompt for location and caption
  (async function processFiles() {
    for (const file of files) {
      const photoSrc = await readFileAsDataURL(file);
      // Prompt for location and caption
      const location = prompt("Enter location for this photo:", "") || "";
      const caption = prompt("Enter caption for this photo:", "") || "";

      const photoData = {
        src: photoSrc,
        caption: caption,
        location: location,
        timestamp: new Date().toLocaleString()
      };

      storedPhotos.unshift(photoData); // newest on top
    }
    localStorage.setItem("photos", JSON.stringify(storedPhotos));
    renderPhotoPosts();
  })();

  input.value = "";
}

// Helper: reads file as Data URL and returns a Promise
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}

function renderPhotoPosts() {
  const gallery = document.getElementById("photoGallery");
  gallery.innerHTML = "";

  const storedPhotos = JSON.parse(localStorage.getItem("photos")) || [];

  storedPhotos.forEach((photo, index) => {
    // Main card container with catch card style
    const card = document.createElement("div");
    card.className = "catch-card";

    // Photo element inside card
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "Catch photo";
    img.className = "catch-photo";
    img.addEventListener("click", () => openModal(photo.src));
    card.appendChild(img);

    // Info container below photo
    const info = document.createElement("div");
    info.className = "catch-info";

    // Caption text
    if (photo.caption) {
      const caption = document.createElement("p");
      caption.className = "catch-caption";
      caption.textContent = photo.caption;
      info.appendChild(caption);
    }

    // Location text
    if (photo.location) {
      const location = document.createElement("p");
      location.className = "catch-location";
      location.textContent = "Location: " + photo.location;
      info.appendChild(location);
    }

    // Timestamp text
    const date = document.createElement("p");
    date.className = "catch-date";
    date.textContent = "Caught: " + (photo.timestamp || new Date().toLocaleString());
    info.appendChild(date);

    card.appendChild(info);

    // Buttons container (share & delete)
    const buttonRow = document.createElement("div");
    buttonRow.className = "catch-buttons";

    // Share button
    const shareButton = document.createElement("button");
    shareButton.innerHTML = `<i class="fas fa-share"></i>`;
    shareButton.title = "Download Catch Card";
    shareButton.addEventListener("click", () => {
      const clone = card.cloneNode(true);
      const watermark = new Image();
      watermark.src = "icon_192x192.png";
      watermark.onload = () => {
        html2canvas(clone, { allowTaint: true }).then(canvas => {
          const ctx = canvas.getContext("2d");
          const scale = 0.15;
          const iconWidth = watermark.width * scale;
          const iconHeight = watermark.height * scale;
          ctx.drawImage(
            watermark,
            canvas.width - iconWidth - 20,
            canvas.height - iconHeight - 20,
            iconWidth,
            iconHeight
          );
          const link = document.createElement("a");
          link.download = `catch-card-${index + 1}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          openInstagramModal();
        });
      };
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    deleteButton.title = "Delete Photo";
    deleteButton.addEventListener("click", () => {
      storedPhotos.splice(index, 1);
      localStorage.setItem("photos", JSON.stringify(storedPhotos));
      renderPhotoPosts();
    });

    buttonRow.appendChild(shareButton);
    buttonRow.appendChild(deleteButton);
    card.appendChild(buttonRow);

    gallery.appendChild(card);
  });


    buttonRow.appendChild(shareButton);
    buttonRow.appendChild(deleteButton);
    container.appendChild(buttonRow);

    gallery.appendChild(container);
  });
}

// Modal viewer for full-screen photo
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = src;
}

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

// Instagram sharing modal
function openInstagramModal() {
  document.getElementById("instagramModal").style.display = "flex";
}

document.getElementById("closeInstagramModal").addEventListener("click", () => {
  document.getElementById("instagramModal").style.display = "none";
});
