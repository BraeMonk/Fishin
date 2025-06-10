document.addEventListener("DOMContentLoaded", () => {
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

  const fishList = document.querySelector(".fishList");
  const grandTotalEl = document.getElementById("grandTotal");
  const photoGallery = document.getElementById("photoGallery");
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
        <div id="${name}-info" style="display:none; margin-top:0.5rem; color:#cc3300;">
          <strong>Rig:</strong> ${rig}<br>
          <strong>Bait:</strong> ${bait}
        </div>
      </div>
    `;
    fishList.appendChild(item);
  });

  recalculateTotal();

  window.adjustCount = function (name, delta) {
    const countEl = document.getElementById(`${name}-count`);
    if (!countEl) return;
    let count = parseInt(countEl.textContent, 10) + delta;
    count = Math.max(0, count);
    countEl.textContent = count;
    localStorage.setItem(name, count);
    recalculateTotal();
  };

  function recalculateTotal() {
    let total = 0;
    fishData.forEach(({ name }) => {
      const countEl = document.getElementById(`${name}-count`);
      total += countEl ? parseInt(countEl.textContent, 10) : 0;
    });
    grandTotal = total;
    grandTotalEl.textContent = grandTotal;
  }

  window.resetSeason = function () {
    fishData.forEach(({ name }) => {
      const countEl = document.getElementById(`${name}-count`);
      if (countEl) countEl.textContent = "0";
      localStorage.removeItem(name);
    });
    grandTotalEl.textContent = "0";
  };

  // Load saved photo posts from localStorage
  function renderPhotoPosts() {
    photoGallery.innerHTML = "";
    const savedPosts = JSON.parse(localStorage.getItem("photoPosts") || "[]");

    savedPosts.forEach(({ src, caption, location }) => {
      const container = document.createElement("div");
      container.className = "photo-container";

      const img = document.createElement("img");
      img.src = src;
      img.alt = caption;
      img.className = "gallery-photo";
      img.addEventListener("click", () => expandPhoto(src));

      const capEl = document.createElement("p");
      capEl.textContent = caption;

      const locEl = document.createElement("p");
      locEl.textContent = location;
      locEl.style.fontStyle = "italic";
      locEl.style.fontSize = "0.9rem";

      container.appendChild(img);
      container.appendChild(capEl);
      container.appendChild(locEl);
      photoGallery.appendChild(container);
    });
  }

  renderPhotoPosts();
});

  // Tab navigation
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

  // Photo memory tab
  const photoInput = document.getElementById("photoInput");
  const photoCaption = document.getElementById("photoCaption");
  const photoLocation = document.getElementById("photoLocationInput");
  const photoGallery = document.getElementById("photoGallery");

  document.getElementById("savePostBtn").addEventListener("click", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const container = document.createElement("div");
      container.className = "photo-container";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = photoCaption.value;
      img.className = "gallery-photo";
      img.addEventListener("click", () => expandPhoto(img.src));

      const caption = document.createElement("p");
      caption.textContent = photoCaption.value || "No Caption";

      const location = document.createElement("p");
      location.textContent = photoLocation.value || "Unknown Location";
      location.style.fontStyle = "italic";
      location.style.fontSize = "0.9rem";

      container.appendChild(img);
      container.appendChild(caption);
      container.appendChild(location);

      photoGallery.appendChild(container);
      photoInput.value = "";
      photoCaption.value = "";
      photoLocation.value = "";
    };

    reader.readAsDataURL(file);
  });

  function expandPhoto(src) {
    const overlay = document.createElement("div");
    overlay.className = "expanded-photo";
    overlay.innerHTML = `<img src="${src}" style="width:100%; height:auto; border-radius:6px;" />`;
    overlay.addEventListener("click", () => overlay.remove());
    document.body.appendChild(overlay);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW regd:', r.scope))
      .catch(console.error));
}
