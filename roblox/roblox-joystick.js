/* roblox-joystick.js - Input Controller */

window.joystick = { x: 0, y: 0, active: false };

document.addEventListener('DOMContentLoaded', () => {
    // Wait for HTML
    setTimeout(() => {
        const zone = document.getElementById('joystick-zone');
        const knob = document.getElementById('joystick-knob');

        if (!zone || !knob) return;

        const handleMove = (clientX, clientY) => {
            const rect = zone.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            let dx = clientX - cx;
            let dy = clientY - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const maxDist = rect.width / 2;

            if (dist > maxDist) {
                dx *= maxDist / dist;
                dy *= maxDist / dist;
            }

            knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            
            window.joystick.x = dx / maxDist;
            window.joystick.y = dy / maxDist;
            window.joystick.active = true;
        };

        const reset = () => {
            knob.style.transform = `translate(-50%, -50%)`;
            window.joystick.x = 0;
            window.joystick.y = 0;
            window.joystick.active = false;
        };

        zone.addEventListener('touchstart', (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY), {passive:false});
        zone.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
        zone.addEventListener('touchend', reset);
    }, 100);
});
