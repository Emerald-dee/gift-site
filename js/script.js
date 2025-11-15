// --- CONFIGURATION ---
const UNLOCK_DATETIME_STRING = "2025-11-15T00:00:00";

// --- ELEMENT SELECTORS ---
const lockScreen = document.getElementById('lock-screen');
const websiteContent = document.getElementById('website-content');

// New selectors for the countdown display
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// --- CORE LOGIC ---
const unlockInterval = setInterval(() => {
    const unlockTime = new Date(UNLOCK_DATETIME_STRING);
    const currentTime = new Date();
    const totalSecondsLeft = (unlockTime - currentTime) / 1000;

    // Check if the time has come
    if (totalSecondsLeft < 0) {
        clearInterval(unlockInterval); // Stop the countdown
        lockScreen.style.display = 'none';
        websiteContent.style.display = 'block';
        return; // Exit the function
    }

    // Calculate the time parts
    const days = Math.floor(totalSecondsLeft / 3600 / 24);
    const hours = Math.floor(totalSecondsLeft / 3600) % 24;
    const minutes = Math.floor(totalSecondsLeft / 60) % 60;
    const seconds = Math.floor(totalSecondsLeft) % 60;

    // Update the HTML with the new values
    daysEl.innerHTML = formatTime(days);
    hoursEl.innerHTML = formatTime(hours);
    minutesEl.innerHTML = formatTime(minutes);
    secondsEl.innerHTML = formatTime(seconds);

}, 1000);

// Helper function to add a leading zero
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// --- ALBUM & MUSIC INTERACTIVITY (FIXED VERSION) ---

const enterButton = document.getElementById('enter-button');
const landingPage = document.getElementById('landing-page');
const backgroundSong = document.getElementById('background-song');
const albumContainer = document.getElementById('photo-album-container');

let albumInitialized = false, currentPage = 0;

function initializeAlbum() {
    const album = $('#album');
    
    // Calculate responsive dimensions
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    
    // Use 80% of viewport for better fit, with max constraints
    const albumWidth = Math.min(1000, windowWidth * 0.8);
    const albumHeight = Math.min(700, windowHeight * 0.8);

    // If already initialized, just resize
    if (albumInitialized && album.turn('is')) {
        album.turn('size', albumWidth, albumHeight);
        return;
    }
    
    // Initialize Turn.js for the first time
    album.turn({
        width: albumWidth,
        height: albumHeight,
        elevation: 50,
        gradients: true,
        autoCenter: true,   
        display: 'double',
        acceleration: true,
        duration: 1000,
        when: {
            turned: function(event, page) {
                currentPage = page;
                // console.log('Current page: ' + page);
            }
        }
    });
    
    albumInitialized = true;
    
    // Force a layout recalculation after initialization
    setTimeout(() => {
        album.turn('resize');
    }, 100);
}

// Listen for a click on the "Begin the Journey" button
enterButton.addEventListener('click', () => {
    
    // Play the music
    backgroundSong.play().catch(error => console.log("Audio play failed: ", error));

    // Hide the landing page
    landingPage.style.display = 'none';

    // Show the album container first
    albumContainer.style.display = 'flex';

    // Wait for the container to be fully rendered before initializing
    setTimeout(() => {
        initializeAlbum();
    }, 50);
});

// Handle window resize
$(window).on('resize', function() {
    if (albumInitialized && $('#album').turn('is')) {
        initializeAlbum();
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    const album = document.getElementById('album'),
        children = album.children;
    let next = true;

    for(var i = 0; i< album.childElementCount; i++) {
        let child = children[i];
        const button = document.createElement('button', type='button');

        button.classList.add('b1');

        child.appendChild(button);
        if (next) button.textContent = '➤';
        else button.textContent = '⮜';

        if  (i === album.childElementCount - 1) button.textContent ='';
        else if (i === 0) button.textContent = "Enter";
    
        button.classList.add('page-'+i)
        button.addEventListener('click', (event) => changePage(event.target));
        next = !next;
    }
});

function changePage(button) {
    let bclass = button.classList[button.classList.length - 1],
        page = parseInt(bclass.substring(bclass.indexOf("-") + 1)) + 1;
    // console.log("button clicked on page " + page);
    if (page % 2 === 1) {
        $('#album').turn('page', page + 1);
    } else {
        $('#album').turn('page', page - 1);
    }
    
}