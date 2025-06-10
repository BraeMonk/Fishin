
document.addEventListener('DOMContentLoaded', () => {
    // Tallying logic and memory tab handling here
});

function showTab(tabName) {
    document.getElementById('tallyTab').style.display = (tabName === 'tally') ? 'block' : 'none';
    document.getElementById('memoriesTab').style.display = (tabName === 'memories') ? 'block' : 'none';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function resetSeason() {
    localStorage.clear();
    location.reload();
}

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
        const el = document.createElement('div');
        el.className = 'note-item';
        el.innerHTML = `<div class="note-date">${note.date}</div><div class="note-text">${note.text}</div><button onclick="deleteNote(${idx})">X</button>`;
        list.appendChild(el);
    });
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function uploadPhoto(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const photos = JSON.parse(localStorage.getItem('photos') || '[]');
        photos.push(reader.result);
        localStorage.setItem('photos', JSON.stringify(photos));
        loadPhotos();
    };
    reader.readAsDataURL(event.target.files[0]);
}

function loadPhotos() {
    const gallery = document.getElementById('photoGallery');
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    gallery.innerHTML = '';
    photos.forEach((src, idx) => {
        const div = document.createElement('div');
        div.innerHTML = `<img src="${src}" class="photo"><button onclick="deletePhoto(${idx})">X</button>`;
        gallery.appendChild(div);
    });
}

function deletePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos.splice(index, 1);
    localStorage.setItem('photos', JSON.stringify(photos));
    loadPhotos();
}
