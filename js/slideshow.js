// slideshow.js

let slideIndex = 1;
let playing = false;
let slideInterval;

showSlides(slideIndex);

function plusSlides(n) {
    clearInterval(slideInterval);
    playing = false;
    updatePlayButton();
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
        slides[i].classList.remove("slide-in");
    }
    slides[slideIndex-1].style.display = "block";  
    slides[slideIndex-1].classList.add("slide-in");
}

function playSlides() {
    if (!playing) {
        playing = true;
        slideInterval = setInterval(() => {
            showSlides(slideIndex += 1);
        }, 3000);
    } else {
        clearInterval(slideInterval);
        playing = false;
    }
    updatePlayButton();
}

function updatePlayButton() {
    const playButton = document.querySelector('.play-button');
    if (playing) {
        playButton.innerHTML = '&#10074;&#10074;'; // Pause icon
    } else {
        playButton.innerHTML = '&#9658;'; // Play icon
    }
}
