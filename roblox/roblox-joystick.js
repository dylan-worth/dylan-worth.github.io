/* roblox-joystick.js - UPDATED VERSION */
class Joystick {
    constructor() {
        this.active = false;
        this.data = { x: 0, y: 0 };
        this.origin = { x: 0, y: 0 };
        this.element = null;
        this.stick = null;
        
        // Initialize immediately
        this.init();
    }

    init() {
        // 1. Inject CSS for the joystick
        const style = document.createElement('style');
        style.innerHTML = `
            #virtual-joystick-zone {
                position: absolute;
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                z-index: 9999;
                display: none; /* Hidden until clicked */
                pointer-events: none; /* Let events pass through */
            }
            #virtual-stick {
                position: absolute;
                top: 50%; left: 50%;
                width: 50px; height: 50px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
        `;
        document.head.appendChild(style);

        // 2. Create DOM Elements
        this.element = document.createElement('div');
        this.element.id = 'virtual-joystick-zone';
        this.stick = document.createElement('div');
        this.stick.id = 'virtual-stick';
        this.element.appendChild(this.stick);
        document.body.appendChild(this.element);

        // 3. Add Event Listeners (Touch AND Mouse)
        // Touch
        document.addEventListener('touchstart', e => this.start(e.touches[0].clientX, e.touches[0].clientY), {passive:false});
        document.addEventListener('touchmove', e => this.move(e.touches[0].clientX, e.touches[0].clientY), {passive:false});
        document.addEventListener('touchend', () => this.end());
        
        // Mouse (For desktop testing)
        document.addEventListener('mousedown', e => this.start(e.clientX, e.clientY));
        document.addEventListener('mousemove', e => this.move(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => this.end());
    }

    start(x, y) {
        // Only activate on Left Side of screen
        if (x < window.innerWidth / 2) {
            this.active = true;
            this.origin = { x, y };
            
            this.element.style.display = 'block';
            this.element.style.left = (x - 60) + 'px';
            this.element.style.top = (y - 60) + 'px';
            this.stick.style.transform = `translate(-50%, -50%)`;
            
            this.data = { x: 0, y: 0 };
        }
    }

    move(x, y) {
        if (!this.active) return;

        let dx = x - this.origin.x;
        let dy = y - this.origin.y;

        // Cap distance at 60px
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 60;
        
        if (dist > maxDist) {
            const ratio = maxDist / dist;
            dx *= ratio;
            dy *= ratio;
        }

        // Normalize output (-1 to 1)
        this.data.x = dx / maxDist;
        this.data.y = dy / maxDist;

        // Visual update
        this.stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    end() {
        this.active = false;
        this.data = { x: 0, y: 0 };
        this.element.style.display = 'none';
    }

    getX() { return this.data.x; }
    getY() { return this.data.y; }
}

// Start the joystick
window.joystick = new Joystick();
