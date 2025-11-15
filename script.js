/* =================================================================== */
/* ===       FINAL, SIMPLIFIED & BUG-FREE SCRIPT (Version 4.0)     === */
/* =================================================================== */

// --- Section 1: Countdown Timer Logic (This part is fine) ---
const UNLOCK_DATETIME_STRING = "2025-11-15T12:00:00";
const lockScreen = document.getElementById('lock-screen');
const websiteContent = document.getElementById('website-content');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const unlockInterval = setInterval(() => {
    const unlockTime = new Date(UNLOCK_DATETIME_STRING);
    const currentTime = new Date();
    const totalSecondsLeft = (unlockTime - currentTime) / 1000;

    if (totalSecondsLeft < 0) {
        clearInterval(unlockInterval);
        if (lockScreen) lockScreen.style.display = 'none';
        if (websiteContent) websiteContent.style.display = 'block';
        
        triggerConfetti();
        return;
    }
    const days = Math.floor(totalSecondsLeft / 3600 / 24);
    const hours = Math.floor(totalSecondsLeft / 3600) % 24;
    const minutes = Math.floor(totalSecondsLeft / 60) % 60;
    const seconds = Math.floor(totalSecondsLeft) % 60;

    if (daysEl) daysEl.innerHTML = formatTime(days);
    if (hoursEl) hoursEl.innerHTML = formatTime(hours);
    if (minutesEl) minutesEl.innerHTML = formatTime(minutes);
    if (secondsEl) secondsEl.innerHTML = formatTime(seconds);
}, 1000);

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// --- Section 2: Album & Music Interactivity (Completely Rewritten for Stability) ---
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });

    // A celebratory burst!
    myConfetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.6 },
        // Use your theme's colors
        colors: ['#D4AF37', '#FFFFFF', '#002D62']
    });
}

const enterButton = document.getElementById('enter-button');
const landingPage = document.getElementById('landing-page');
const backgroundSong = document.getElementById('background-song');
const albumContainer = document.getElementById('photo-album-container');
const album = $('#album');

// Our new navigation buttons
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');

// This function intelligently shows/hides the navigation buttons
function updateButtons(currentPage, totalPages) {
    // Hide PREV button if we are on the first page (cover)
    prevButton.style.display = (currentPage <= 1) ? 'none' : 'flex';
    // Hide NEXT button if we are on the last page
    nextButton.style.display = (currentPage >= totalPages) ? 'none' : 'flex';
}

// Main function to set up the album
function initializeAlbum() {
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const albumWidth = Math.min(1000, windowWidth * 0.9);
    const albumHeight = Math.min(700, windowHeight * 0.8);

    album.turn({
        width: albumWidth,
        height: albumHeight,
        elevation: 50,
        gradients: true,
        autoCenter: true,
        display: 'double',
        duration: 1000,
        // CRITICAL BUG FIX: Disable acceleration to prevent rendering issues
        acceleration: false, 
        
        // This 'when' event is the key to our new navigation system
        when: {
            turned: function(event, page, view) {
                // 'page' is the new page number. 'view' tells us what's visible.
                const totalPages = album.turn('pages');
                updateButtons(page, totalPages);
            }
        }
    });
}

// --- Event Listeners ---

// 1. When the "Enter" button is clicked
enterButton.addEventListener('click', () => {
    backgroundSong.play().catch(error => console.log("Audio play failed: ", error));
    landingPage.style.display = 'none';
    albumContainer.style.display = 'flex';
    initializeAlbum();
});

// 2. When the NEXT button is clicked
nextButton.addEventListener('click', () => {
    album.turn('next');
});

// 3. When the PREVIOUS button is clicked
prevButton.addEventListener('click', () => {
    album.turn('previous');
});

// 4. When the browser window is resized
$(window).on('resize', function() {
    if (album.turn('is')) {
        // Recalculate size and recenter
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        const albumWidth = Math.min(1000, windowWidth * 0.9);
        const albumHeight = Math.min(700, windowHeight * 0.8);
        album.turn('size', albumWidth, albumHeight);
    }
});

// --- REMOVED THE OLD, BUGGY BUTTON INJECTION CODE ---
// The new system is simpler, faster, and works correctly.