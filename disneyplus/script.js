const movies = [
    { id: "m1", title: "Iron Man", category: "marvel" },
    { id: "m2", title: "Moana", category: "recommended" },
    { id: "m3", title: "Black Panther", category: "marvel" },
    { id: "m4", title: "Avatar", category: "recommended" },
    { id: "m5", title: "Avengers", category: "marvel" },
    { id: "m6", title: "Loki", category: "marvel" },
];

function init() {
    renderGrid('recommended-grid', movies.filter(m => m.category === 'recommended'));
    renderGrid('marvel-grid', movies.filter(m => m.category === 'marvel'));
    renderContinueWatching();
}

function renderGrid(containerId, movieSet) {
    const container = document.getElementById(containerId);
    container.innerHTML = movieSet.map(movie => createCard(movie)).join('');
}

function createCard(movie) {
    const progress = localStorage.getItem(`progress_${movie.id}`) || 0;
    return `
        <div class="movie-card" onclick="playMovie('${movie.id}')">
            <div class="placeholder">${movie.title}</div>
            <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
    `;
}

// Feature 3: Continue Watching Logic
function renderContinueWatching() {
    const continueGrid = document.getElementById('continue-grid');
    const continueSection = document.getElementById('continue-section');
    
    // Find movies with progress between 1% and 95%
    const inProgress = movies.filter(m => {
        const p = localStorage.getItem(`progress_${m.id}`);
        return p > 0 && p < 95;
    });

    if (inProgress.length > 0) {
        continueSection.style.display = 'block';
        continueGrid.innerHTML = inProgress.map(movie => createCard(movie)).join('');
    } else {
        continueSection.style.display = 'none';
    }
}

function playMovie(id) {
    // Feature 9: Simulate progress tracking
    const p = prompt("Simulate watch progress (0-100):");
    if (p !== null) {
        localStorage.setItem(`progress_${id}`, p);
        init(); // Refresh all grids
    }
}

// Run on load
window.onload = init;
