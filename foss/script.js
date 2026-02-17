// Add a "trail" effect or interactive movement
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.post-card');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    cards.forEach(card => {
        // Subtle movement based on mouse position
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;

        const angleX = (cardY - mouseY) / 30;
        const angleY = (cardX - mouseX) / -30;

        card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) rotate(var(--angle))`;
    });
});

// Randomly scatter cards slightly on load
window.onload = () => {
    console.log("Gallery initialized by us.");
};