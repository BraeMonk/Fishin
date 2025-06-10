document.addEventListener('DOMContentLoaded', () => {
    loadTallies();
    loadNotes();
    loadPhotos();
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

// Tally logic
function loadTallies() {
    const fishList = document.getElementById('fishList');
    fishList.innerHTML = '';
    let seasonTotal = 0;

    fishSpecies.forEach((fish, idx) => {
        const tally = localStorage.getItem(`fish-${idx}`) || 0;
        seasonTotal += parseInt(tally);

        const fishItem = document.createElement('div');
        fishItem.className = 'fish-item';
        fishItem.innerHTML = `
            <button onclick="toggleFishDetails(${idx})" class="fish-name">${fish.name}</button>
            <div id="fish-${idx}-details" class="fish-details">
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
    let tally = parseInt(localStorage.getItem(`fish-${index}`) || 0);
    tally++;
    localStorage.setItem(`fish-${index}`, tally);
    loadTallies();
}

function decreaseTally(index) {
    let tally = parseInt(localStorage.getItem(`fish-${index}`) || 0);
    if (tally > 0) tally--;
    localStorage.setItem(`fish-${index}`, tally);
    loadTallies();
}

function toggleFishDetails(index) {
    const details = document.getElementById(`fish-${index}-details`);
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

function resetSeason() {
    fishSpecies.forEach((_, idx) => localStorage.removeItem(`fish-${idx}`));
    loadTallies();
}

// Tab switching
function showTab(tabName) {
    document.getElementById('tallyTab').style.display = (tabName === 'tally') ? 'block' : 'none';
    document.getElementById('memoriesTab').style.display = (tabName === 'memories') ? 'block' : 'none';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Notes
function saveNote() {
    const text = document.getElementById('noteInput').value.trim();
    if (!text) return;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push({ date: new Date().toLocaleString(), text });
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('noteInput').value = '';
    loadNotes();
}

function loadNotes() {
    const list = document.getElementById('notesList');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    list.innerHTML = '';

    notes.forEach((note, idx) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note-item';
        noteEl.innerHTML = `
            <div class="note-date">${note.date}</div>
            <div contenteditable="true" class="note-text" onblur="updateNote(${idx}, this.innerText)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${note.text}</div>
            <button onclick="deleteNote(${idx})">Delete</button>
        `;
        list.appendChild(noteEl);
    });
}

function updateNote(index, newText) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes[index].text = newText.trim();
    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function uploadPhoto(event) {
    const captionInput = document.getElementById('photoCaption');
    const caption = captionInput.value.trim();
    if (!event.target.files[0]) return;

    const reader = new FileReader();
    reader.onload = () => {
        const photoData = {
            src: reader.result,
            caption: caption || '(No caption)',
            date: new Date().toLocaleString()
        };

        // Attempt to get GPS
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                photoData.location = {
                    lat: pos.coords.latitude.toFixed(6),
                    lng: pos.coords.longitude.toFixed(6)
                };
                savePhoto(photoData);
            }, () => {
                savePhoto(photoData); // No GPS or permission denied
            });
        } else {
            savePhoto(photoData); // GPS not supported
        }

        captionInput.value = ''; // Clear caption input
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

    photos.forEach((photo, idx) => {
        const div = document.createElement('div');
        div.className = 'photo-container';
        div.innerHTML = `
            <img src="${photo.src}" class="photo-thumb" onclick="openModal('${photo.src}')">
            <div class="photo-caption"><strong>Caption:</strong> ${photo.caption}</div>
            <div class="photo-date">${photo.date}</div>
            ${photo.location ? `<div class="photo-location">📍 ${photo.location.lat}, ${photo.location.lng}</div>` : ''}
            <button onclick="deletePhoto(${idx})">Delete</button>
        `;
        gallery.appendChild(div);
    });
}

function updatePhotoCaption(index, newCaption) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos[index].caption = newCaption.trim();
    localStorage.setItem('photos', JSON.stringify(photos));
}

function deletePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos.splice(index, 1);
    localStorage.setItem('photos', JSON.stringify(photos));
    loadPhotos();
}

// Modal viewer
function openModal(src, date, caption) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImg');
    const modalText = document.getElementById('modalCaption');
    const modalDate = document.getElementById('modalDate');
    modal.style.display = 'flex';
    modalImage.src = src;
    modalText.textContent = caption || '';
    modalDate.textContent = date || '';
}

function closeModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// Drag and drop
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        uploadPhoto({ target: { files: e.dataTransfer.files } });
    }
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}
