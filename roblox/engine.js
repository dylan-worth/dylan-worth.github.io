/* engine.js - Core System with Editor Hooks */

// --- BASE NODE ---
class Node {
    constructor(name) {
        this.id = Math.random().toString(36).substr(2, 9); // Unique ID
        this.name = name || "Node";
        this.children = [];
        this.parent = null;
        this.sceneObj = null; // The visual mesh
        
        // Editor Variables (Editable in Inspector)
        this.export = {
            x: 0, y: 0, z: 0,
            visible: true
        };
    }

    _ready() {}
    
    _process(delta) {
        // Sync Exported Vars to Visuals
        if (this.sceneObj) {
            this.sceneObj.position.set(this.export.x, this.export.y, this.export.z);
            this.sceneObj.visible = this.export.visible;
        }
    }

    add_child(node) {
        node.parent = this;
        this.children.push(node);
        if (node.sceneObj) Game.scene.add(node.sceneObj);
        
        // Notify Editor
        if (window.Editor) window.Editor.refreshTree();
        node._ready();
    }
}

// --- GAME SINGLETON ---
const Game = {
    scene: null, camera: null, renderer: null,
    root: new Node("Root"),
    running: false, // Editor Mode vs Play Mode

    init: function(container) {
        // 1. Three.js Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222); // Dark Editor Grey
        this.scene.fog = new THREE.Fog(0x222222, 20, 100);

        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // 2. Lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 100, 50);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));
        
        // 3. Grid Helper (Editor feel)
        this.scene.add(new THREE.GridHelper(50, 50));

        // 4. Start Loop
        this.clock = new THREE.Clock();
        this._animate();
    },

    _animate: function() {
        requestAnimationFrame(() => this._animate());
        const delta = this.clock.getDelta();

        // Only run game logic if "Playing"
        if (this.running) {
            this._updateNode(this.root, delta);
        }

        this.renderer.render(this.scene, this.camera);
    },

    _updateNode: function(node, delta) {
        node._process(delta);
        node.children.forEach(c => this._updateNode(c, delta));
    }
};

// --- PREFABS (Like .tscn files) ---
class CubeObj extends Node {
    constructor(name, color=0x00ff00) {
        super(name);
        this.sceneObj = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshStandardMaterial({color: color})
        );
        this.sceneObj.castShadow = true;
        
        // Set initial props
        this.export.x = 0;
        this.export.y = 1;
        this.export.z = 0;
    }
    
    _process(delta) {
        // Example: Spin logic if running
        if(Game.running) {
            this.sceneObj.rotation.y += delta;
        }
        super._process(delta);
    }
}
