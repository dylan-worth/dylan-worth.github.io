document.addEventListener('DOMContentLoaded', function() {
    const link = document.querySelector('.trigger-link');

    if (!link) {
        console.log('Link not found');
        return;
    }

    link.addEventListener('mouseenter', function(event) {
        for (let i = 0; i < 10; i++) {
            let star = document.createElement('div');
            star.className = 'star';
            star.textContent = '★';
            this.appendChild(star);

            // Random start position around the link
            star.style.left = `${Math.random() * 100 - 50}%`;
            star.style.top = `-${Math.random() * 20}px`;

            // Animate the star
            setTimeout(() => {
                star.style.top = '100px'; // Move down
                star.style.opacity = '0'; // Fade out
                setTimeout(() => star.remove(), 1000); // Remove after animation
            }, 10);
        }
    });
});