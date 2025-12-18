/* roblox-joystick.js */
class Joystick {
    constructor() {
        this.active = false;
        this.data = { x: 0, y: 0 }; // Values between -1 and 1
        this.origin = { x: 0, y: 0 };
        this.element = null;
        this.stick = null;

        // Only initialize if on a touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.init();
        }
    }

    init() {
        // Create Styles
        const style = document.createElement('style');
        style.innerHTML = `
            #virtual-joystick-zone {
                position: absolute;
                bottom: 50px;
                left: 50px;
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                touch-action: none;
                z-index: 9999;
                display: none; /* Hidden until touched nearby */
            }
            #virtual-stick {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        // Create Elements
        this.element = document.createElement('div');
        this.element.id = 'virtual-joystick-zone';
        this.stick = document.createElement('div');
        this.stick.id = 'virtual-stick';
        this.element.appendChild(this.stick);
        document.body.appendChild(this.element);

        // Global Touch Listeners (Dynamic Joystick)
        document.addEventListener('touchstart', (e) => this.start(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.move(e), { passive: false });
        document.addEventListener('touchend', (e) => this.end(e));
    }

    start(e) {
        // Only activate if touching left side of screen
        const touch = e.touches[0];
        if (touch.clientX < window.innerWidth / 2) {
            this.active = true;
            this.origin.x = touch.clientX;
            this.origin.y = touch.clientY;
            
            // Move joystick visual to finger
            this.element.style.display = 'block';
            this.element.style.left = (this.origin.x - 60) + 'px';
            this.element.style.top = (this.origin.y - 60) + 'px';
            this.stick.style.transform = `translate(-50%, -50%)`;
            
            this.data = { x: 0, y: 0 };
        }
    }

    move(e) {
        if (!this.active) return;
        const touch = e.touches[0];
        
        // Calculate Delta
        let dx = touch.clientX - this.origin.x;
        let dy = touch.clientY - this.origin.y;

        // Cap distance (radius 60px)
        const distance = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 60;
        
        if (distance > maxDist) {
            const ratio = maxDist / distance;
            dx *= ratio;
            dy *= ratio;
        }

        // Normalize Data (-1 to 1)
        this.data.x = dx / maxDist;
        this.data.y = dy / maxDist;

        // Move Stick Visual
        this.stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    end(e) {
        if (this.active) {
            this.active = false;
            this.data = { x: 0, y: 0 };
            this.element.style.display = 'none';
        }
    }

    // Helper for Game Loops
    getX() { return this.data.x; }
    getY() { return this.data.y; }
}

// Initialize globally
window.joystick = new Joystick();
