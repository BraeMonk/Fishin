// Fish data: Local species to Barrie, Ontario with rig & bait suggestions
const fishSpecies = [
  {
    name: "Largemouth Bass",
    rig: "Texas Rig, Wacky Rig",
    bait: "Soft plastics (worms, craws), live minnows",
  },
  {
    name: "Smallmouth Bass",
    rig: "Drop Shot, Ned Rig",
    bait: "Tube jigs, crayfish imitations",
  },
  {
    name: "Northern Pike",
    rig: "Wire leader with spinnerbait",
    bait: "Large spoons, crankbaits, live baitfish",
  },
  {
    name: "Muskellunge",
    rig: "Heavy tackle with jerkbaits",
    bait: "Large swimbaits, live suckers",
  },
  {
    name: "Yellow Perch",
    rig: "Drop Shot or Float Rig",
    bait: "Live worms, small jigs",
  },
  {
    name: "Walleye",
    rig: "Bottom Bouncer, Jig Head",
    bait: "Minnows, leeches, nightcrawlers",
  },
  {
    name: "Lake Trout",
    rig: "Trolling with Downriggers",
    bait: "Spoons, minnows",
  },
  {
    name: "Rainbow Trout",
    rig: "Float rig or spinning",
    bait: "Salmon eggs, worms, small spinners",
  },
  {
    name: "Brown Trout",
    rig: "Inline spinner or baitfish rig",
    bait: "Minnows, crankbaits",
  },
  {
    name: "Brook Trout",
    rig: "Fly fishing or light spinning",
    bait: "Flies, worms, salmon eggs",
  },
  {
    name: "Crappie",
    rig: "Minnow rig or jig",
    bait: "Small minnows, tube jigs",
  },
  {
    name: "Sunfish (Bluegill)",
    rig: "Float rig",
    bait: "Worms, small insects",
  },
  {
    name: "Rock Bass",
    rig: "Jig or small spinner",
    bait: "Worms, small crankbaits",
  },
  {
    name: "Burbot",
    rig: "Bottom rig with dead bait",
    bait: "Cut bait, minnows",
  },
  {
    name: "Whitefish",
    rig: "Small jigs or spoons",
    bait: "Wax worms, maggots",
  },
  {
    name: "Catfish",
    rig: "Bottom rig",
    bait: "Stink bait, cut bait, chicken liver",
  },
];

function saveTally() {
  const tallies = {};
  document.querySelectorAll('.species').forEach((el) => {
    const name = el.dataset.name;
    const count = parseInt(el.querySelector('.count').textContent, 10);
    tallies[name] = count;
  });
  localStorage.setItem('fishTallies', JSON.stringify(tallies));
}

function loadTally() {
  const saved = JSON.parse(localStorage.getItem('fishTallies')) || {};
  document.querySelectorAll('.species').forEach((el) => {
    const name = el.dataset.name;
    const count = saved[name] || 0;
    el.querySelector('.count').textContent = count;
  });
}

function resetTally() {
  localStorage.removeItem('fishTallies');
  document.querySelectorAll('.count').forEach((c) => (c.textContent = '0'));
}

function createSpeciesElement(species) {
  const div = document.createElement('div');
  div.classList.add('species');
  div.dataset.name = species.name;

  div.innerHTML = `
    <div class="species-header" onclick="toggleDetails(this)">
      <span class="name">${species.name}</span>
      <span class="count">0</span>
      <button class="add-btn" onclick="event.stopPropagation(); incrementTally(this)">+</button>
    </div>
    <div class="details">
      <p><strong>Rig:</strong> ${species.rig}</p>
      <p><strong>Bait:</strong> ${species.bait}</p>
    </div>
  `;
  return div;
}

function incrementTally(btn) {
  const speciesDiv = btn.closest('.species');
  const countEl = speciesDiv.querySelector('.count');
  countEl.textContent = parseInt(countEl.textContent, 10) + 1;
  saveTally();
}

function toggleDetails(header) {
  const details = header.nextElementSibling;
  details.classList.toggle('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tally-container');
  fishSpecies.forEach((fish) => {
    container.appendChild(createSpeciesElement(fish));
  });

  loadTally();

  document.getElementById('reset-btn').addEventListener('click', resetTally);

  // Notes photo section
  const notesImageInput = document.getElementById('photo-upload');
  const notesImageDisplay = document.getElementById('photo-gallery');

  notesImageInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result;
        img.className = 'note-image';
        notesImageDisplay.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
});
