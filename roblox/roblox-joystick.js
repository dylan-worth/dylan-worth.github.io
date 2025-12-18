/* roblox-joystick.js - Universal Controller */

// Global State that games can read
window.joystick = { x: 0, y: 0, active: false };

document.addEventListener('DOMContentLoaded', () => {
    const zone = document.getElementById('joystick-zone');
    const knob = document.getElementById('joystick-knob');

    if (!zone || !knob) {
        console.warn("Joystick elements not found in HTML.");
        return;
    }

    // Input Handling
    function handleInput(clientX, clientY, isEnd) {
        if (isEnd) {
            window.joystick.x = 0;
            window.joystick.y = 0;
            window.joystick.active = false;
            knob.style.transform = `translate(-50%, -50%)`;
            return;
        }

        const rect = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;
        
        // Distance Cap (keep knob inside circle)
        const distance = Math.sqrt(dx*dx + dy*dy);
        const maxDist = rect.width / 2; // Dynamic based on size

        if (distance > maxDist) {
            const ratio = maxDist / distance;
            dx *= ratio;
            dy *= ratio;
        }

        // Move Knob Visual
        knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

        // Update Global State (-1 to 1)
        window.joystick.x = dx / maxDist;
        window.joystick.y = dy / maxDist;
        window.joystick.active = true;
    }

    // Touch Events
    zone.addEventListener('touchstart', (e) => {
        handleInput(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Stop scroll
        handleInput(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    zone.addEventListener('touchend', () => {
        handleInput(0, 0, true);
    });

    // Mouse Events (For PC Testing)
    let dragging = false;
    zone.addEventListener('mousedown', (e) => { dragging = true; handleInput(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => { if(dragging) handleInput(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { if(dragging) { dragging = false; handleInput(0,0,true); } });
});
