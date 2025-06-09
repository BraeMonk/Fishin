function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('preview');
        output.src = reader.result;
        localStorage.setItem('fishing_note_image', reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', function () {
    const storedImage = localStorage.getItem('fishing_note_image');
    if (storedImage) {
        document.getElementById('preview').src = storedImage;
    }
});