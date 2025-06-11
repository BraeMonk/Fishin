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

function toggleInfo(name) {
  const infoEl = document.getElementById(`${name}-info`);
  if (!infoEl) return;
  infoEl.style.display = infoEl.style.display === "none" ? "block" : "none";
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

  const processNext = (index = 0) => {
    if (index >= files.length) {
      fileInput.value = ""; // Reset file input
      renderPhotoPosts();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const caption = prompt("Enter a caption for this photo:") || "";
      const location = prompt("Enter a location for this photo:") || "";

      const newPost = {
        image: e.target.result,
        caption: caption.trim(),
        location: location.trim(),
        timestamp: new Date().toLocaleString()
      };

      existingPosts.unshift(newPost);
      localStorage.setItem("photoGallery", JSON.stringify(existingPosts));

      processNext(index + 1);
    };
    reader.readAsDataURL(files[index]);
  };

  processNext();
}

function renderPhotoPosts() {
  const photoGallery = document.getElementById("photoGallery");
  if (!photoGallery) return;

  photoGallery.innerHTML = "";

  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];

  savedPosts.forEach((post, index) => {
    const container = document.createElement("div");
    container.className = "photo-container";
    container.style.border = "1px solid #444";
    container.style.padding = "10px";
    container.style.marginBottom = "20px";
    container.style.borderRadius = "6px";
    container.style.backgroundColor = "#111";
    container.style.color = "#f5f5dc";
    container.style.maxWidth = "400px";

    // Image
    const image = document.createElement("img");
    image.src = post.image;
    image.alt = post.caption || "Photo";
    image.style.width = "100%";
    image.style.borderRadius = "4px";
    container.appendChild(image);

    // Caption
    const captionDiv = document.createElement("div");
    captionDiv.textContent = `Caption: ${post.caption || "(none)"}`;
    captionDiv.style.marginTop = "8px";
    container.appendChild(captionDiv);

    // Location
    const locationDiv = document.createElement("div");
    locationDiv.textContent = `Location: ${post.location || "(none)"}`;
    container.appendChild(locationDiv);

    // Timestamp
    const timestampDiv = document.createElement("div");
    timestampDiv.style.fontSize = "0.8rem";
    timestampDiv.style.color = "#aaa";
    timestampDiv.style.marginTop = "6px";
    timestampDiv.textContent = post.timestamp || "";
    container.appendChild(timestampDiv);

    // Buttons row
    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "center";
    buttonRow.style.gap = "0.75rem";
    buttonRow.style.marginTop = "0.5rem";

    const buttons = [
      {
        icon: '<i class="fas fa-save"></i>',
        title: "Save",
        action: () => {
          saveCaption(index);
          showSavedStatus(document.getElementById(`caption-${index}`));
        }
      },
      {
        icon: '<i class="fas fa-trash-alt"></i>',
        title: "Delete",
        action: () => deletePhoto(index)
      },
      {
        icon: '<i class="fas fa-share-square"></i>',
        title: "Share",
        action: () => sharePost(index)
      },
      {
        icon: '<i class="fas fa-fish"></i>',
        title: "Catch Card",
        action: () => generateCatchCard(index)
      }
    ];

    buttons.forEach(btn => {
      const button = document.createElement("button");
      button.innerHTML = btn.icon;
      button.title = btn.title;
      button.onclick = btn.action;
      button.style.background = "none";
      button.style.border = "none";
      button.style.color = "#f5f5dc";
      button.style.fontSize = "1.3rem";
      button.style.cursor = "pointer";
      buttonRow.appendChild(button);
    });

    container.appendChild(buttonRow);
    photoGallery.appendChild(container);
  });
}

// ====== Caption Editing & Feedback ======
function saveCaption(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const captionInput = document.getElementById(`caption-${index}`);
  if (!captionInput) return;
  const newCaption = captionInput.value.trim();
  savedPosts[index].caption = newCaption;
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

// ====== Sharing and Catch Card ======
function generateCatchCard(index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];
  if (!post) return;

  const card = document.createElement("div");
  card.style.width = "400px";
  card.style.padding = "20px";
  card.style.margin = "20px auto";
  card.style.border = "2px solid #5e4322";
  card.style.borderRadius = "10px";
  card.style.background = "url('https://www.transparenttextures.com/patterns/paper-fibers.png') #fdf5e6";
  card.style.fontFamily = "'Courier New', Courier, monospace";
  card.style.boxShadow = "4px 4px 10px rgba(0,0,0,0.3)";
  card.style.color = "#3e2d16";
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:10px;">
      <h2 style="margin:0; font-size:1.5rem; text-decoration:underline;">Catch Log</h2>
      <div style="font-size:0.9rem;">${post.timestamp}</div>
    </div>
    <img src="${post.image}" style="width:100%; border-radius:6px; border:1px solid #5e4322; margin-bottom:10px;" />
    <div style="margin-bottom:5px;"><strong>Caption:</strong> <em>${post.caption}</em></div>
    <div style="margin-bottom:5px;"><strong>Location:</strong> <em>${post.location}</em></div>
    <img src="icon_192x192.png" alt="Fishin’ Buddy Icon"
         style="width:50px; margin-top:10px; float:right; opacity:0.85;" />
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

// ====== Modal Functions ======
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  if (!modal || !modalImage) return;

  modalImage.src = imageSrc;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;
  modal.style.display = "none";
}

// Optional: Add event listener for close button if modal exists
const closeBtn = document.getElementById("closeInstagramModal");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("instagramModal");
    if (modal) modal.style.display = "none";
  });
}

function showInstagramModal() {
  const modal = document.getElementById("instagramModal");
  if (modal) modal.style.display = "flex";
}

function shareToInstagram(index) {
  generateCatchCard(index);
  showInstagramModal();
}

function shareToPlatform(platform, index) {
  const savedPosts = JSON.parse(localStorage.getItem("photoGallery")) || [];
  const post = savedPosts[index];
  if (!post) return;

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
      alert("Unsupported platform");
      return;
  }

  window.open(shareURL, "_blank");
}
