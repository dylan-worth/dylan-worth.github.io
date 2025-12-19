/* roblox-core.js - Godot-Like Web Engine */

// --- BASE CLASS: NODE ---
// Everything in your game will extend this!
class Node {
    constructor(name) {
        this.name = name || "Node";
        this.children = [];
        this.parent = null;
        this.sceneObj = null; // The THREE.js mesh (if any)
    }

    // Godot: _ready() runs when added to the scene
    _ready() {}

    // Godot: _process(delta) runs every frame
    _process(delta) {}

    add_child(node) {
        node.parent = this;
        this.children.push(node);
        
        // If this node has a visual mesh, add it to the scene
        if (node.sceneObj) {
            R.scene.add(node.sceneObj);
        }
        
        node._ready();
    }

    // Internal: Runs recursively for the whole tree
    _update(delta) {
        this._process(delta);
        this.children.forEach(child => child._update(delta));
    }
}

// --- THE ENGINE SINGLETON (Like "GetTree()" in Godot) ---
const R = {
    // Systems
    root: null, // The "Root" node of your scene tree
    scene: null, camera: null, renderer: null,
    inputs: { x: 0, y: 0, jump: false },
    
    init: function() {
        console.log("Godot-Lite: Starting...");
        const container = document.getElementById('game-container');

        // 1. Three.js Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        
        container.innerHTML = "";
        container.appendChild(this.renderer.domElement);

        // 2. Setup Input Interface
        this._setupInputs(container);

        // 3. Setup Root Node
        this.root = new Node("Root");

        // 4. Default Lighting (So you can see)
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 100, 50);
        light.castShadow = true;
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // 5. Start Loop
        this.clock = new THREE.Clock();
        this._animate();
    },

    _animate: function() {
        requestAnimationFrame(() => this._animate());
        const delta = this.clock.getDelta();

        // UPDATE THE SCENE TREE
        if (this.root) {
            this.root._update(delta);
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    },

    _setupInputs: function(container) {
        // Joystick Logic (Simplified for Engine)
        const joy = document.createElement('div');
        joy.style.cssText = "position:absolute; bottom:50px; left:30px; width:100px; height:100px; background:rgba(255,255,255,0.2); border-radius:50%; z-index:100;";
        const knob = document.createElement('div');
        knob.style.cssText = "position:absolute; top:50%; left:50%; width:40px; height:40px; background:white; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none;";
        joy.appendChild(knob);
        container.appendChild(joy);

        const handleMove = (x, y) => {
            const rect = joy.getBoundingClientRect();
            const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2;
            let dx = x - cx; let dy = y - cy;
            // Normalize inputs -1 to 1
            this.inputs.x = Math.max(-1, Math.min(1, dx / 40));
            this.inputs.y = Math.max(-1, Math.min(1, dy / 40));
            
            // Visual Limit
            const d = Math.sqrt(dx*dx+dy*dy);
            if(d > 40) { dx *= 40/d; dy *= 40/d; }
            knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        };

        joy.addEventListener('touchmove', e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); });
        joy.addEventListener('touchend', () => { this.inputs.x=0; this.inputs.y=0; knob.style.transform=`translate(-50%,-50%)`; });
        
        // Jump Button
        const btn = document.createElement('div');
        btn.innerText = "JUMP";
        btn.style.cssText = "position:absolute; bottom:50px; right:30px; width:80px; height:80px; background:rgba(0,255,0,0.3); border-radius:50%; color:white; display:flex; justify-content:center; align-items:center; font-weight:bold; z-index:100; cursor:pointer;";
        btn.ontouchstart = () => { this.inputs.jump = true; };
        btn.ontouchend = () => { this.inputs.jump = false; };
        container.appendChild(btn);
    }
};
