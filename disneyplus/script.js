/**
 * Disney+ Clone - Logic Script
 * Features: LocalStorage progress tracking, Watchlist (My List), 
 * Search, Hero Carousel, and Modal Details.
 */

// 1. DATA: Movies and Series
const movies = [
    { id: "m1", title: "Iron Man", category: "marvel", type: "movie", new: false, description: "Billionaire industrialist Tony Stark creates a high-tech suit of armor to fight crime." },
    { id: "m2", title: "Moana", category: "recommended", type: "movie", new: true, description: "A determined Polynesian princess sets sail to save her people across the ocean." },
    { id: "m3", title: "Black Panther", category: "marvel", type: "movie", new: false, description: "T'Challa, king of Wakanda, rises to the throne and takes on his enemies to protect his nation." },
    { id: "m4", title: "Avatar", category: "recommended", type: "movie", new: true, description: "A paraplegic Marine dispatched to the moon Pandora becomes torn between following orders and protecting the world." },
    { id: "m5", title: "Avengers Endgame", category: "marvel", type: "movie", new: false, description: "The Avengers assemble one last time to undo Thanos's actions and restore order to the universe." },
    { id: "m6", title: "Loki", category: "marvel", type: "series", new: false, description: "The mercurial villain Loki resumes his role as the God of Mischief following the events of Endgame." },
    { id: "m7", title: "The Mandalorian", category: "starwars", type: "series", new: false, description: "A lone gunfighter makes his way through the outer reaches of the lawless galaxy." },
    { id: "m8", title: "Toy Story 4", category: "pixar", type: "movie", new: true, description: "Woody, Buzz, and the gang embark on a road trip with Bonnie and her new toy, Forky." },
    { id: "m9", title: "Frozen II", category: "disney", type: "movie", new: false, description: "Anna and Elsa embark on a new adventure far away from Arendelle." },
    { id: "m10", title: "Free Solo", category: "natgeo", type: "movie", new: true, description: "Alex Honnold attempts to become the first person to free solo climb El Capitan." },
    { id: "m11", title: "The Simpsons", category: "disney", type: "series", new: false, description: "The satiric adventures of a working-class family in the misfit city of Springfield." },
    { id: "m12", title: "WandaVision", category: "marvel", type: "series", new: false, description: "Super-powered beings Wanda and Vision begin to suspect that everything is not as it seems." }
];

const heroItems = [
    { id: "m7", title: "The Mandalorian", description: "The travels of a lone bounty hunter in the outer reaches of the galaxy.", img: "https://via.placeholder.com/1200x500/1a1d29/f9f9f9?text=The+Mandalorian+Banner" },
    { id: "m5", title: "Avengers Endgame", description: "The epic conclusion to the Infinity Saga.", img: "https://via.placeholder.com/1200x500/1a1d29/f9f9f9?text=Avengers+Endgame+Banner" },
    { id: "m2", title: "Moana", description: "Experience the magic of the ocean.", img: "https://via.placeholder.com/1200x500/1a1d29/f9f9f9?text=Moana+Banner" }
];

// 2. STATE MANAGEMENT
let currentHeroIndex = 0;
let heroInterval;
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// 3. CORE INITIALIZATION
function init() {
    renderHeroCarousel();
    refreshGrids();
    setupEventListeners();
}

function refreshGrids(filterQuery = '') {
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(filterQuery.toLowerCase())
    );

    // Filtered Content Rows
    renderGrid('recommended-grid', filteredMovies.filter(m => m.category === 'recommended'));
    renderGrid('movies-grid', filteredMovies.filter(m => m.type === 'movie'));
    renderGrid('series-grid', filteredMovies.filter(m => m.type === 'series'));
    
    // Feature Rows
    renderContinueWatching();
    renderMyList();
    renderNewAndComingSoon();
}

// 4. RENDERING LOGIC
function createCard(movie) {
    const progress = localStorage.getItem(`progress_${movie.id}`) || 0;
    const isAddedToList = watchlist.includes(movie.id);

    return `
        <div class="movie-card" data-id="${movie.id}">
            <div class="placeholder">${movie.title}</div>
            <div class="card-overlay">
                <button class="play-btn" onclick="event.stopPropagation(); simulatePlay('${movie.id}')">
                    ${progress > 0 ? '▶ RESUME' : '▶ PLAY'}
                </button>
                <button class="list-btn" onclick="event.stopPropagation(); toggleWatchlist('${movie.id}')">
                    ${isAddedToList ? '✓ ON LIST' : '+ MY LIST'}
                </button>
            </div>
            <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
    `;
}

function renderGrid(containerId, movieSet) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = movieSet.map(movie => createCard(movie)).join('');

    // Modal click logic
    container.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.id));
    });
}

// 5. FEATURE SPECIFIC RENDERING
function renderContinueWatching() {
    const container = document.getElementById('continue-grid');
    const section = document.getElementById('continue-section');
    const inProgress = movies.filter(m => {
        const p = localStorage.getItem(`progress_${m.id}`);
        return p > 0 && p < 95;
    });

    if (inProgress.length > 0) {
        section.style.display = 'block';
        container.innerHTML = inProgress.map(m => createCard(m)).join('');
    } else {
        section.style.display = 'none';
    }
}

function renderMyList() {
    const container = document.getElementById('mylist-grid');
    const section = document.getElementById('mylist-section');
    const listMovies = movies.filter(m => watchlist.includes(m.id));

    if (listMovies.length > 0) {
        section.style.display = 'block';
        container.innerHTML = listMovies.map(m => createCard(m)).join('');
    } else {
        section.style.display = 'none';
    }
}

function renderNewAndComingSoon() {
    const container = document.getElementById('new-coming-soon-grid');
    const newMovies = movies.filter(m => m.new);
    container.innerHTML = newMovies.map(m => createCard(m)).join('');
}

// 6. HERO CAROUSEL LOGIC
function renderHeroCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.getElementById('carouselDots');
    
    track.innerHTML = heroItems.map(item => `
        <div class="hero-item">
            <img src="${item.img}" alt="${item.title}">
            <div class="hero-overlay">
                <h1>${item.title}</h1>
                <p>${item.description}</p>
                <div class="hero-btns">
                    <button class="play-btn" onclick="simulatePlay('${item.id}')">▶ PLAY</button>
                    <button class="list-btn" onclick="toggleWatchlist('${item.id}')">
                        ${watchlist.includes(item.id) ? '✓ ON LIST' : '+ MY LIST'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    dots.innerHTML = heroItems.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="goToHero(${i})"></span>`).join('');
    
    startHeroTimer();
}

function goToHero(index) {
    currentHeroIndex = index;
    const track = document.getElementById('carouselTrack');
    track.style.transform = `translateX(-${index * 100}%)`;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    startHeroTimer(); // Reset timer on manual click
}

function startHeroTimer() {
    clearInterval(heroInterval);
    heroInterval = setInterval(() => {
        currentHeroIndex = (currentHeroIndex + 1) % heroItems.length;
        goToHero(currentHeroIndex);
    }, 6000);
}

// 7. INTERACTION HANDLERS
function toggleWatchlist(id) {
    if (watchlist.includes(id)) {
        watchlist = watchlist.filter(item => item !== id);
    } else {
        watchlist.push(id);
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    refreshGrids();
}

function simulatePlay(id) {
    const currentProgress = localStorage.getItem(`progress_${id}`) || 0;
    const newProgress = prompt(`Simulate watching ${id}. Enter progress (0-100):`, currentProgress);
    
    if (newProgress !== null) {
        localStorage.setItem(`progress_${id}`, Math.min(100, Math.max(0, newProgress)));
        refreshGrids();
    }
}

function setupEventListeners() {
    // Search Feature
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        refreshGrids(e.target.value);
    });

    // Brand Filtering
    document.querySelectorAll('.brand-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const brand = tile.dataset.brand;
            refreshGrids(brand); // Simple filter by category
        });
    });

    // Modal Close
    const closeBtn = document.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('movie-details-modal').style.display = 'none';
        };
    }
}

// 8. MODAL LOGIC
function openModal(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const modal = document.getElementById('movie-details-modal');
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-description').textContent = movie.description;
    document.getElementById('modal-image').src = `https://via.placeholder.com/900x250/1a1d29/f9f9f9?text=${encodeURIComponent(movie.title)}`;
    
    modal.style.display = 'flex';
}

// Global scope assignments for inline HTML onclicks
window.simulatePlay = simulatePlay;
window.toggleWatchlist = toggleWatchlist;
window.goToHero = goToHero;

// Start the app
window.onload = init;
