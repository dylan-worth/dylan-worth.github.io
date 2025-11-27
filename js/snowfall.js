const SNOW_CONTAINER = document.getElementById('snow-container');
const FOOTER = document.getElementById('page-footer');

// Get the top boundary of the footer where the snow should melt
function getMeltBoundary() {
    // pageYOffset accounts for scroll position
    return FOOTER.getBoundingClientRect().top + window.pageYOffset;
}

// Configuration
const MAX_SNOWFLAKES = 100; // Total snowflakes on screen
const FALL_SPEED = 2;      // Pixels per update
const UPDATE_INTERVAL = 30; // Milliseconds (approx. 33 FPS)

function createSnowflake() {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    
    // Random size between 2px and 5px
    const size = Math.random() * 3 + 2; 
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    
    // Starting position (random X, Y just off the top of the screen)
    flake.x = Math.random() * window.innerWidth;
    flake.y = -size;
    
    flake.style.left = flake.x + 'px';
    flake.style.top = flake.y + 'px';
    
    // Store properties on the element for easier access
    flake.fallRate = Math.random() * FALL_SPEED + 1; // Slight variation in speed
    flake.wind = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
    
    SNOW_CONTAINER.appendChild(flake);
}

function updateSnowflakes() {
    const meltBoundary = getMeltBoundary();
    const snowflakes = document.querySelectorAll('.snowflake');

    snowflakes.forEach(flake => {
        // 1. Calculate new position
        flake.y += flake.fallRate;
        flake.x += flake.wind;
        
        // 2. Check for melting condition
        if (flake.y > meltBoundary) {
            // Apply the melting class (CSS handles the fade out)
            flake.classList.add('melting');
            
            // Set a timeout to remove the snowflake after the melt transition
            setTimeout(() => {
                flake.remove();
            }, 1000); // Matches the CSS transition time
            
        } else {
            // 3. Update position on screen
            flake.style.top = flake.y + 'px';
            flake.style.left = flake.x + 'px';
        }
        
        // 4. Handle boundary reset (if it falls off the bottom completely or melts before being removed)
        if (flake.y > window.innerHeight && !flake.classList.contains('melting')) {
            // Reset snowflake back to the top if it falls past the screen
            flake.y = -5; 
            flake.x = Math.random() * window.innerWidth;
        }
    });

    // 5. Create new snowflakes if needed
    if (snowflakes.length < MAX_SNOWFLAKES) {
        createSnowflake();
    }
}

// Start the snow simulation
setInterval(updateSnowflakes, UPDATE_INTERVAL);
// Triggering  is unnecessary here as the code is provided.
