/* roblox-cam.js - Advanced 3rd Person Camera */

class RobloxCamera {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement; // Usually document.body or a specific div
        this.target = new THREE.Vector3(0, 0, 0); // What we are looking at

        // Camera State (Spherical Coordinates)
        this.radius = 15;
        this.theta = Math.PI;     // Horizontal Angle
        this.phi = Math.PI / 3;   // Vertical Angle

        // Smooth Targets (For that buttery smooth feel)
        this.tRadius = this.radius;
        this.tTheta = this.theta;
        this.tPhi = this.phi;

        // Settings
        this.minRadius = 5;
        this.maxRadius = 50;
        this.sensitivityX = 0.004;
        this.sensitivityY = 0.004;
        this.smoothness = 0.1; // Lower is smoother/slower
        
        // Input State
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.pinchStartDist = 0;
        this.isPinching = false;
        this.active = true;

        this.init();
    }

    init() {
        // TOUCH EVENTS
        this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), {passive: false});
        this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e), {passive: false});
        this.domElement.addEventListener('touchend', () => { this.isPinching = false; });

        // MOUSE EVENTS (For PC testing)
        let isDragging = false;
        this.domElement.addEventListener('mousedown', (e) => { isDragging = true; this.lastTouchX = e.clientX; this.lastTouchY = e.clientY; });
        window.addEventListener('mousemove', (e) => { if(isDragging) this.handleLook(e.clientX, e.clientY); });
        window.addEventListener('mouseup', () => isDragging = false);
        this.domElement.addEventListener('wheel', (e) => {
            this.tRadius += e.deltaY * 0.05;
            this.clampRadius();
        });
    }

    onTouchStart(e) {
        if (!this.active) return;
        
        // 1 Finger: Look
        if (e.touches.length === 1) {
            this.lastTouchX = e.touches[0].clientX;
            this.lastTouchY = e.touches[0].clientY;
        }
        
        // 2 Fingers: Pinch Zoom
        if (e.touches.length === 2) {
            this.isPinching = true;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            this.pinchStartDist = Math.sqrt(dx*dx + dy*dy);
            this.pinchStartRadius = this.tRadius;
        }
    }

    onTouchMove(e) {
        if (!this.active) return;
        e.preventDefault(); // Prevent scrolling page

        // Look
        if (e.touches.length === 1 && !this.isPinching) {
            this.handleLook(e.touches[0].clientX, e.touches[0].clientY);
        }

        // Zoom
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Calculate Zoom Ratio
            const ratio = this.pinchStartDist / dist;
            this.tRadius = this.pinchStartRadius * ratio;
            this.clampRadius();
        }
    }

    handleLook(x, y) {
        const dx = x - this.lastTouchX;
        const dy = y - this.lastTouchY;

        this.tTheta -= dx * this.sensitivityX;
        this.tPhi -= dy * this.sensitivityY;

        // Clamp Vertical (Don't flip over head or go under ground)
        // 0.1 rads from top, 0.1 rads from bottom
        this.tPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, this.tPhi));

        this.lastTouchX = x;
        this.lastTouchY = y;
    }

    clampRadius() {
        this.tRadius = Math.max(this.minRadius, Math.min(this.maxRadius, this.tRadius));
    }

    // Call this in your animate() loop
    update(targetPosition) {
        // 1. Smoothly Interpolate current values to target values
        this.theta += (this.tTheta - this.theta) * this.smoothness;
        this.phi += (this.tPhi - this.phi) * this.smoothness;
        this.radius += (this.tRadius - this.radius) * this.smoothness;

        // 2. Calculate Cartesian Coordinates
        // x = r * sin(phi) * sin(theta)
        // z = r * sin(phi) * cos(theta)
        // y = r * cos(phi)
        
        const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.radius * Math.cos(this.phi);

        // 3. Update Camera Position relative to Player
        this.camera.position.set(
            targetPosition.x + x,
            targetPosition.y + y,
            targetPosition.z + z
        );

        // 4. Look at Player (slightly above center)
        this.camera.lookAt(targetPosition.x, targetPosition.y + 1, targetPosition.z);
    }
}

// Attach to window so HTML files can see it
window.RobloxCamera = RobloxCamera;
