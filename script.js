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
    const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];

    Array.from(fileInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(event) {
        savedPosts.push({
          image: event.target.result,
          caption,
          location,
          timestamp: new Date().toLocaleString(),
        });
        localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
        renderPhotoPosts();
      };
      reader.readAsDataURL(file);
    });

    // Clear inputs after upload
    fileInput.value = "";
    document.getElementById("photoCaption").value = "";
    document.getElementById("photoLocationInput").value = "";
  } else {
    console.error("No files selected.");
  }
}

  function renderPhotoPosts() {
  const photoGallery = document.getElementById("photoGallery");
  photoGallery.innerHTML = "";

  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];

  savedPosts.forEach((post, index) => {
    const container = document.createElement("div");
    container.className = "photo-container";

    container.innerHTML = `
  <img src="${post.image}" class="gallery-photo" onclick="openModal('${post.image}')" />
  <input type="text" id="caption-${index}" value="${post.caption}" style="width: 100%; margin-top: 5px;" />
  <div>${post.location}</div>
  <div style="font-size:0.8rem; color:#aaa;">${post.timestamp}</div>
  <button onclick="saveCaption(${index})">Save Caption</button>
  <button onclick="deletePhoto(${index})" style="margin-top:5px;">Delete</button>
  <div class="share-buttons">
  <button onclick="sharePost(${index})" style="margin-top:5px;">Share</button>
  <button onclick="shareToPlatform('facebook', ${index})">Facebook</button>
  <button onclick="shareToPlatform('twitter', ${index})">X</button>
  <button onclick="shareToPlatform('whatsapp', ${index})">WhatsApp</button>
</div>
`;

    photoGallery.appendChild(container);
  });
}

function saveCaption(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const newCaption = document.getElementById(`caption-${index}`).value.trim();
  savedPosts[index].caption = newCaption;
  localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
  renderPhotoPosts();
}

function sharePost(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];

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

function shareToPlatform(platform, index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];
  const text = encodeURIComponent(`${post.caption} - ${post.location}`);
  const url = encodeURIComponent(window.location.href);
  let shareURL = "";

  switch (platform) {
    case "facebook":
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      break;
    case "twitter":
      shareURL = `https://twitter.com/intent/tweet?text=${text}%20${url}`;
      break;
    case "whatsapp":
      shareURL = `https://wa.me/?text=${text}%20${url}`;
      break;
    default:
      return alert("Unsupported platform");
  }

  window.open(shareURL, "_blank");
}

function deletePhoto(index) {
  if (!confirm("Are you sure you want to delete this photo?")) return;

  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  savedPosts.splice(index, 1);
  localStorage.setItem("photoGallery", JSON.stringify(savedPosts));
  renderPhotoPosts();
}

function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");

  modalImage.src = imageSrc;
  modal.style.display = "flex";  // Show modal
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none"; // Hide modal
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

