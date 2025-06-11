// ====== Utilities ======

// Read a file and return a base64 string
function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Resize image to a max dimension
function resizeImage(base64Image, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = width * scale;
        height = height * scale;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
    img.src = base64Image;
  });
}

// ====== IndexedDB ======

function getIndexedDBPosts() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FishinBuddyDB", 1);
    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("photos", "readonly");
      const store = tx.objectStore("photos");
      const getAll = store.getAll();
      getAll.onerror = () => reject("Failed to retrieve photos");
      getAll.onsuccess = () => resolve(getAll.result);
    };
  });
}

function saveToIndexedDB(photoData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FishinBuddyDB", 1);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction("photos", "readwrite");
      const store = tx.objectStore("photos");
      const addRequest = store.add(photoData);
      addRequest.onerror = () => reject("Failed to save photo");
      addRequest.onsuccess = () => resolve();
    };
  });
}

function updateIndexedDBPostCaption(index, newCaption) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FishinBuddyDB", 1);
    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction("photos", "readwrite");
      const store = tx.objectStore("photos");
      const getAll = store.getAll();
      getAll.onerror = () => reject("Failed to get photos");
      getAll.onsuccess = () => {
        const posts = getAll.result;
        if (index < 0 || index >= posts.length) {
          reject("Index out of range");
          return;
        }
        const post = posts[index];
        post.caption = newCaption;
        const updateRequest = store.put(post);
        updateRequest.onerror = () => reject("Failed to update caption");
        updateRequest.onsuccess = () => resolve();
      };
    };
  });
}

function deleteIndexedDBPost(index) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FishinBuddyDB", 1);
    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction("photos", "readwrite");
      const store = tx.objectStore("photos");
      const getAll = store.getAll();
      getAll.onerror = () => reject("Failed to get photos");
      getAll.onsuccess = () => {
        const posts = getAll.result;
        if (index < 0 || index >= posts.length) {
          reject("Index out of range");
          return;
        }
        const postToDelete = posts[index];
        const deleteRequest = store.delete(postToDelete.id);
        deleteRequest.onerror = () => reject("Failed to delete photo");
        deleteRequest.onsuccess = () => resolve();
      };
    };
  });
}

// ====== Photo Upload ======

function handleUpload() {
  const input = document.getElementById("photoInput");
  const files = Array.from(input.files);
  if (!files.length) return;

  (async () => {
    for (let file of files) {
      const originalData = await readFile(file);
      const resizedImage = await resizeImage(originalData, 800, 800);
      const photo = {
        image: resizedImage,
        caption: "",
        location: "",
        timestamp: new Date().toISOString()
      };
      await saveToIndexedDB(photo);
    }
    renderPhotoPosts();
  })();
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

// ====== App Load ======

window.addEventListener('DOMContentLoaded', () => {
  initFishList();
  setupTabs();
  recalculateTotal();
  renderPhotoPosts();
});
