
// Full fish species list with rig and bait suggestions
const fishList = [
    {
        name: "Largemouth Bass",
        rig: "Texas Rig, Wacky Rig",
        bait: "Plastic worms, Jigs, Crankbaits"
    },
    {
        name: "Smallmouth Bass",
        rig: "Drop Shot, Ned Rig",
        bait: "Tube baits, Soft plastics, Jerkbaits"
    },
    {
        name: "Northern Pike",
        rig: "Spinnerbait Rig, Wire Leader",
        bait: "Spoons, Spinnerbaits, Live minnows"
    },
    {
        name: "Yellow Perch",
        rig: "Drop Shot, Bobber Rig",
        bait: "Live worms, Small minnows, Jigs"
    },
    {
        name: "Walleye",
        rig: "Bottom Bouncer Rig, Jigging Rig",
        bait: "Nightcrawlers, Minnows, Jigs"
    },
    {
        name: "Black Crappie",
        rig: "Slip Bobber Rig, Jigging",
        bait: "Minnows, Small jigs, Soft plastics"
    },
    {
        name: "Bluegill",
        rig: "Bobber Rig, Drop Shot",
        bait: "Worms, Crickets, Small jigs"
    },
    {
        name: "Pumpkinseed Sunfish",
        rig: "Bobber Rig",
        bait: "Worms, Insects, Dough balls"
    },
    {
        name: "Muskellunge",
        rig: "Heavy Casting Rig, Wire Leader",
        bait: "Large crankbaits, Bucktails, Live bait"
    },
    {
        name: "Brown Bullhead",
        rig: "Bottom Rig",
        bait: "Cut bait, Worms, Stink baits"
    },
    {
        name: "Rock Bass",
        rig: "Light Jigging, Bobber Rig",
        bait: "Worms, Minnows, Small lures"
    },
    {
        name: "Lake Trout",
        rig: "Downrigging, Jigging",
        bait: "Spoons, Minnows, Tube jigs"
    }
];

// Load or initialize tally data
let tally = JSON.parse(localStorage.getItem("tally")) || {};
let notes = localStorage.getItem("notes") || "";
let photos = JSON.parse(localStorage.getItem("photos")) || [];

function saveData() {
    localStorage.setItem("tally", JSON.stringify(tally));
    localStorage.setItem("notes", document.getElementById("notes").value);
    localStorage.setItem("photos", JSON.stringify(photos));
}

function updateDisplay() {
    const list = document.getElementById("fishList");
    list.innerHTML = "";
    fishData.forEach(fish => {
        if (!tally[fish.name]) tally[fish.name] = 0;

        const item = document.createElement("li");
        item.className = "fish-item";

        const title = document.createElement("div");
        title.className = "fish-title";
        title.textContent = `${fish.name}: ${tally[fish.name]}`;
        title.addEventListener("click", () => {
            info.style.display = info.style.display === "block" ? "none" : "block";
        });

        const buttons = document.createElement("div");
        buttons.className = "buttons";
        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.onclick = () => {
            tally[fish.name]++;
            saveData();
            updateDisplay();
        };

        const subBtn = document.createElement("button");
        subBtn.textContent = "-";
        subBtn.onclick = () => {
            tally[fish.name] = Math.max(0, tally[fish.name] - 1);
            saveData();
            updateDisplay();
        };

        const info = document.createElement("div");
        info.className = "fish-info";
        info.innerHTML = `<strong>Rig:</strong> ${fish.rig}<br><strong>Bait:</strong> ${fish.bait}`;
        info.style.display = "none";

        buttons.appendChild(addBtn);
        buttons.appendChild(subBtn);
        item.appendChild(title);
        item.appendChild(buttons);
        item.appendChild(info);
        list.appendChild(item);
    });
}

function updateNotes() {
    document.getElementById("notes").value = notes;
    document.getElementById("notes").addEventListener("input", () => {
        saveData();
    });
}

function handlePhotoUpload() {
    const input = document.getElementById("photoInput");
    const gallery = document.getElementById("photoGallery");
    input.addEventListener("change", () => {
        const files = Array.from(input.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                photos.push(e.target.result);
                saveData();
                displayPhotos();
            };
            reader.readAsDataURL(file);
        });
    });
}

function displayPhotos() {
    const gallery = document.getElementById("photoGallery");
    gallery.innerHTML = "";
    photos.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "photo";
        gallery.appendChild(img);
    });
}

function setupTabs() {
    document.getElementById("tabTally").addEventListener("click", () => {
        document.getElementById("tallyTab").style.display = "block";
        document.getElementById("notesTab").style.display = "none";
        document.getElementById("tabTally").classList.add("active");
        document.getElementById("tabNotes").classList.remove("active");
    });

    document.getElementById("tabNotes").addEventListener("click", () => {
        document.getElementById("tallyTab").style.display = "none";
        document.getElementById("notesTab").style.display = "block";
        document.getElementById("tabTally").classList.remove("active");
        document.getElementById("tabNotes").classList.add("active");
    });
}

function resetSeason() {
    if (confirm("Are you sure you want to reset the season's tally?")) {
        tally = {};
        saveData();
        updateDisplay();
    }
}

document.getElementById("resetBtn").addEventListener("click", resetSeason);

window.onload = () => {
    updateDisplay();
    updateNotes();
    handlePhotoUpload();
    displayPhotos();
    setupTabs();
};
