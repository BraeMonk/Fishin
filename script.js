window.onload = function() {
  const fishList = document.getElementById("fishList");
  const grandTotalEl = document.getElementById("grandTotal");

  if (!fishList) {
    console.error("Error: fishList element not found!");
    return;
  }

  const fishData = [
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

  let grandTotal = 0;

  // Render fish tally list with saved counts
  fishData.forEach(({ name, rig, bait }) => {
    const savedCount = localStorage.getItem(name) || 0;
    const item = document.createElement("div");
    item.className = "fish-item";
    item.innerHTML = `
      <div style="font-weight:bold;">${name}: <span id="${name}-count">${savedCount}</span></div>
      <div class="tally-controls">
        <button onclick="adjustCount('${name}', -1)">-</button>
        <button onclick="adjustCount('${name}', 1)">+</button>
        <button onclick="toggleInfo('${name}')">Info</button>
        <div id="${name}-info" style="display:none;">
          <strong>Rig:</strong> ${rig}<br>
          <strong>Bait:</strong> ${bait}
        </div>
      </div>
    `;
    fishList.appendChild(item);
  });

  renderPhotoPosts();
  recalculateTotal();
  setupTabs();
};

// Move these functions **outside** window.onload to fix button issues
function adjustCount(name, delta) {
  const countEl = document.getElementById(`${name}-count`);
  if (!countEl) return;
  let count = parseInt(countEl.textContent, 10) + delta;
  count = Math.max(0, count);
  countEl.textContent = count;
  localStorage.setItem(name, count);
  recalculateTotal();
}

function handleUpload() {
  const fileInput = document.getElementById("photoInput");
  const caption = document.getElementById("photoCaption").value.trim();
  const location = document.getElementById("photoLocationInput").value.trim();

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
      savedPosts.push({
        image: event.target.result, // Converts image to Base64
        caption,
        location,
        timestamp: new Date().toLocaleString(),
      });

      localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
      renderPhotoPosts();  // Refresh gallery display
    };
    reader.readAsDataURL(fileInput.files[0]); // Converts image file to Base64
  } else {
    console.error("No file selected.");
  }
}

  function renderPhotoPosts() {
  const photoGallery = document.getElementById("photoGallery");
  photoGallery.innerHTML = "";  // Clears previous entries

  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  savedPosts.forEach(post => {
    const container = document.createElement("div");
    container.className = "photo-container";
    container.innerHTML = `
      <img src="${post.image}" class="gallery-photo" onclick="expandImage('${post.image}')" />
      <div><strong>${post.caption}</strong></div>
      <div>${post.location}</div>
      <div style="font-size:0.8rem; color:#aaa;">${post.timestamp}</div>
    `;
    photoGallery.appendChild(container);
  });
}

function toggleInfo(name) {
  const infoEl = document.getElementById(`${name}-info`);
  if (!infoEl) return;
  infoEl.style.display = infoEl.style.display === "none" ? "block" : "none";
}

function recalculateTotal() {
  let total = 0;
  document.querySelectorAll(".fish-item span").forEach(span => {
    total += parseInt(span.textContent, 10);
  });
  document.getElementById("grandTotal").textContent = total;
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const selectedTab = button.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
        if (content.id === selectedTab) content.classList.add("active");
      });
    });
  });
}

document.getElementById("savePostBtn").addEventListener("click", handleUpload);

// Now your buttons should work properly! 🚀🐟

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW regd:', r.scope))
      .catch(console.error));
}

