// Register service worker early
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW registered:', r.scope))
      .catch(console.error));
}

// Called when the DOM is fully loaded
window.onload = function() {
  initFishList();
  setupTabs();
  recalculateTotal();
  renderPhotoPosts();
};

// ====== Initialization Functions ======
function initFishList() {
  const fishList = document.getElementById("fishList");
  if (!fishList) {
    console.error("Error: fishList element not found!");
    return;
  }

  const fishData = getFishData();

  fishData.forEach(({ name, rig, bait }) => {
    const savedCount = localStorage.getItem(name) || 0;
    const item = document.createElement("div");
    item.className = "fish-item";
    item.innerHTML = `
      <div style="font-weight:bold; cursor:pointer;" onclick="toggleInfo('${name}')">${name}: <span id="${name}-count">${savedCount}</span></div>
      <div class="tally-controls">
        <button onclick="adjustCount('${name}', -1)">-</button>
        <button onclick="adjustCount('${name}', 1)">+</button>
        <button onclick="toggleInfo('${name}')">Info</button>
        <div id="${name}-info" style="display:none; margin-top: 5px;">
          <strong>Rig:</strong> ${rig}<br>
          <strong>Bait:</strong> ${bait}
        </div>
      </div>
    `;
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
  ];
}

// ====== UI & Event Handlers ======
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      const tab = button.getAttribute('data-tab');
      button.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });
}

function adjustCount(name, delta) {
  const countEl = document.getElementById(`${name}-count`);
  if (!countEl) return;
  let count = parseInt(countEl.textContent, 10) + delta;
  count = Math.max(0, count);
  countEl.textContent = count;
  localStorage.setItem(name, count);
  recalculateTotal();
}

// Toggle bait and rig info visibility
function toggleInfo(name) {
  const infoEl = document.getElementById(`${name}-info`);
  if (!infoEl) return;
  infoEl.style.display = (infoEl.style.display === "none" || infoEl.style.display === "") ? "block" : "none";
}

function recalculateTotal() {
  let total = 0;
  document.querySelectorAll(".fish-item [id$='-count']").forEach(span => {
    total += parseInt(span.textContent, 10);
  });
  const grandTotalEl = document.getElementById("grandTotal");
  if (grandTotalEl) grandTotalEl.textContent = total;
}

// ====== Photo Gallery ======
function handleUpload() {
  const fileInput = document.getElementById("photoInput");
  const files = Array.from(fileInput.files);

  if (!files.length) {
    alert("Please select a photo to upload.");
    return;
  }

  const existingPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function resizeImage(base64, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = maxWidth / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(maxWidth, img.width);
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(resizedDataUrl);
      };
      img.src = base64;
    });
  }

  // Save to IndexedDB fallback
  function saveToIndexedDB(post) {
    const request = indexedDB.open("FishinBuddyDB", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("photos", "readwrite");
      const store = tx.objectStore("photos");
      store.add(post);
      tx.oncomplete = () => {
        console.log("Saved to IndexedDB.");
        alert("Large image stored safely offline (IndexedDB).");
        renderPhotoPosts();
      };
    };

    request.onerror = (e) => {
      console.error("IndexedDB error:", e.target.error);
      alert("Failed to store large image.");
    };
  }

  (async () => {
    for (let file of files) {
      try {
        const originalData = await readFile(file);
        const resizedData = await resizeImage(originalData);

        // Rough size check for base64 (each char is ~0.75 byte)
        const maxLocalStorageSize = 1000000; // 1MB
        const estimatedSize = resizedData.length * 0.75;

        const caption = prompt("Enter a caption for this photo:") || "";
        const location = prompt("Enter a location for this photo:") || "";

        const newPost = {
          image: resizedData,
          caption: caption.trim(),
          location: location.trim(),
          timestamp: new Date().toLocaleString()
        };

        if (estimatedSize > maxLocalStorageSize) {
          // Too big, fallback to IndexedDB
          saveToIndexedDB(newPost);
        } else {
          // Safe for localStorage
          existingPosts.unshift(newPost);
        }
      } catch (err) {
        console.error("Error processing image:", err);
        alert("There was an error processing one of your photos.");
      }
    }

    localStorage.setItem("photoGallery", JSON.stringify(existingPosts));
    fileInput.value = "";
    renderPhotoPosts();
  })();
}

function renderPhotoPosts() {
  const photoGallery = document.getElementById("photoGallery");
  if (!photoGallery) return;

  photoGallery.innerHTML = "";

  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];

  // Display posts from localStorage
  savedPosts.forEach((post, index) => {
    createPhotoCard(post, index, false); // false = not IndexedDB
  });

  // Display posts from IndexedDB
  const request = indexedDB.open("FishinBuddyDB", 1);

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("photos", "readonly");
    const store = tx.objectStore("photos");

    const getAll = store.getAll();
    getAll.onsuccess = () => {
      getAll.result.forEach((post, index) => {
        createPhotoCard(post, index, true); // true = from IndexedDB
      });
    };
  };
}

function createPhotoCard(post, index, fromIndexedDB) {
  const photoGallery = document.getElementById("photoGallery");

  const container = document.createElement("div");
  container.className = "photo-container";
  container.style = `
    border: 1px solid #444;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 6px;
    background-color: #111;
    color: #f5f5dc;
    max-width: 400px;
  `;

  const image = document.createElement("img");
  image.src = post.image;
  image.alt = post.caption || "Photo";
  image.className = "thumbnail";
  image.style = "width: 100%; border-radius: 4px; cursor: pointer;";
  container.appendChild(image);

  // Caption container
  const captionDiv = document.createElement("div");
  captionDiv.style = "margin-top: 8px; display: flex; align-items: center; gap: 6px;";
  
  const captionText = document.createElement("span");
  captionText.id = `caption-text-${index}`;
  captionText.textContent = post.caption || "(no caption)";
  captionDiv.appendChild(captionText);

  // Pencil edit icon
  const editBtn = document.createElement("button");
  editBtn.title = "Edit caption";
  editBtn.innerHTML = "✏️"; // pencil emoji or use "&#9998;"
  editBtn.style = "background:none; border:none; cursor:pointer; color:#f5f5dc; font-size:1.1rem;";
  captionDiv.appendChild(editBtn);

  container.appendChild(captionDiv);

  // Location div
  const locationDiv = document.createElement("div");
  locationDiv.textContent = `Location: ${post.location || "(none)"}`;
  container.appendChild(locationDiv);

  // Timestamp div
  const timestampDiv = document.createElement("div");
  timestampDiv.textContent = post.timestamp;
  timestampDiv.style = "font-size: 0.8rem; color: #aaa; margin-top: 6px;";
  container.appendChild(timestampDiv);

  // Buttons row
  const buttonRow = document.createElement("div");
  buttonRow.style = "display:flex; justify-content:center; gap:0.75rem; margin-top:0.5rem;";

  const buttons = [
    {
      icon: '🗑️', title: "Delete", action: () => deletePhoto(index, fromIndexedDB)
    },
    {
      icon: '📤', title: "Share", action: () => sharePost(index, fromIndexedDB)
    },
    {
      icon: '🎣', title: "Catch Card", action: () => generateCatchCard(index)
    }
  ];

  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.innerHTML = btn.icon;
    b.title = btn.title;
    b.onclick = btn.action;
    b.style = "background:none; border:none; color:#f5f5dc; font-size:1.3rem; cursor:pointer;";
    buttonRow.appendChild(b);
  });

  container.appendChild(buttonRow);
  photoGallery.appendChild(container);

  // ====== Caption editing logic ======
  editBtn.addEventListener("click", () => {
    // Replace caption text with input + save/cancel buttons
    captionDiv.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = post.caption || "";
    input.style = "flex-grow:1; padding: 4px; border-radius: 4px; border: 1px solid #ccc;";
    captionDiv.appendChild(input);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style = "margin-left: 6px; cursor:pointer;";
    captionDiv.appendChild(saveBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style = "margin-left: 4px; cursor:pointer;";
    captionDiv.appendChild(cancelBtn);

    saveBtn.addEventListener("click", () => {
      const newCaption = input.value.trim();
      // Save caption to localStorage
      const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
      savedPosts[index].caption = newCaption;
      localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
      renderPhotoPosts();
    });

    cancelBtn.addEventListener("click", () => {
      // Restore original caption display
      renderPhotoPosts();
    });
  });
}

// ====== Caption Editing ======
function saveCaption(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const captionInput = document.getElementById(`caption-${index}`);
  if (!captionInput) return;
  savedPosts[index].caption = captionInput.value.trim();
  localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
  renderPhotoPosts();
}

function showSavedStatus(element) {
  if (!element) return;
  const originalBorder = element.style.border;
  const originalBG = element.style.background;
  element.style.border = "2px solid #4caf50";
  element.style.background = "#003300";
  setTimeout(() => {
    element.style.border = originalBorder;
    element.style.background = originalBG;
  }, 1500);
}

// ====== Sharing & Export ======
function generateCatchCard(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];
  if (!post) return;

  const card = document.createElement("div");
  card.style = `
    width: 400px;
    padding: 20px;
    margin: 20px auto;
    border: 2px solid #5e4322;
    border-radius: 10px;
    background: url('https://www.transparenttextures.com/patterns/paper-fibers.png') #fdf5e6;
    font-family: 'Courier New', Courier, monospace;
    box-shadow: 4px 4px 10px rgba(0,0,0,0.3);
    color: #3e2d16;
  `;
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:10px;">
      <h2 style="margin:0; font-size:1.5rem; text-decoration:underline;">Catch Log</h2>
      <div style="font-size:0.9rem;">${post.timestamp}</div>
    </div>
    <img src="${post.image}" style="width:100%; border-radius:6px; border:1px solid #5e4322; margin-bottom:10px;" />
    <div><strong>Caption:</strong> <em>${post.caption}</em></div>
    <div><strong>Location:</strong> <em>${post.location}</em></div>
    <img src="icon_192x192.png" alt="Fishin’ Buddy Icon" style="width:50px; margin-top:10px; float:right; opacity:0.85;" />
    <div style="clear:both;"></div>
  `;

  document.body.appendChild(card);
  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "catch-card.png";
    link.href = canvas.toDataURL();
    link.click();
    document.body.removeChild(card);
  });
}

function sharePost(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];
  if (!post) return;

  if (navigator.share) {
    navigator.share({
      title: "Fishin' Buddy Catch!",
      text: `${post.caption} - ${post.location}`,
      url: window.location.href
    }).then(() => {
      console.log('Post shared successfully');
    }).catch((error) => {
      console.error('Error sharing:', error);
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}

function deletePhoto(index) {
  if (!confirm("Are you sure you want to delete this photo?")) return;
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  savedPosts.splice(index, 1);
  localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
  renderPhotoPosts();
}
