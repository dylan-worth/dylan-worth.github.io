/* roblox-cam.js - Camera Controller */

class RobloxCamera {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // State
        this.radius = 20;
        this.theta = Math.PI; 
        this.phi = Math.PI / 3; 
        this.target = new THREE.Vector3(0, 0, 0);

        // Smooth Targets
        this.tRadius = this.radius;
        this.tTheta = this.theta;
        this.tPhi = this.phi;

        // Input
        this.lastX = 0;
        this.lastY = 0;
        this.pinchDist = 0;
        
        this.init();
    }

    init() {
        this.domElement.addEventListener('touchstart', (e) => {
            if(e.touches.length === 1) {
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.pinchDist = Math.sqrt(dx*dx + dy*dy);
                this.pinchStartRadius = this.tRadius;
            }
        }, {passive: false});

        this.domElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if(e.touches.length === 1) {
                const dx = e.touches[0].clientX - this.lastX;
                const dy = e.touches[0].clientY - this.lastY;
                this.tTheta -= dx * 0.005;
                this.tPhi -= dy * 0.005;
                this.tPhi = Math.max(0.1, Math.min(Math.PI/2 - 0.1, this.tPhi));
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const ratio = this.pinchDist / dist;
                this.tRadius = Math.max(5, Math.min(50, this.pinchStartRadius * ratio));
            }
        }, {passive: false});
    }

    update(targetPos) {
        // Smooth interpolation
        this.radius += (this.tRadius - this.radius) * 0.1;
        this.theta += (this.tTheta - this.theta) * 0.1;
        this.phi += (this.tPhi - this.phi) * 0.1;

        const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.radius * Math.cos(this.phi);

        this.camera.position.set(targetPos.x + x, targetPos.y + y, targetPos.z + z);
        this.camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);
    }
}
window.RobloxCamera = RobloxCamera;
