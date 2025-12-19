/* engine.js - Core System + Scripting */

class Node {
    constructor(name) {
        this.name = name || "Node";
        this.children = [];
        this.parent = null;
        this.sceneObj = null;
        
        // THE SCRIPT
        // This string holds the code you write in the editor!
        this.script = ""; 
        this._scriptFunc = null; // compiled function

        // Editor Props
        this.export = { x: 0, y: 0, z: 0, visible: true };
    }

    _ready() {
        // When game starts, compile the text into a function
        if (this.script && this.script.trim() !== "") {
            try {
                // 'delta' is passed as an argument
                this._scriptFunc = new Function('delta', this.script);
            } catch (e) {
                console.error("Script Error in " + this.name, e);
            }
        }
    }
    
    _process(delta) {
        // Sync Editor Props
        if (this.sceneObj) {
            this.sceneObj.position.set(this.export.x, this.export.y, this.export.z);
        }

        // RUN USER SCRIPT
        if (Game.running && this._scriptFunc) {
            try {
                // Execute the script with 'this' bound to the node
                this._scriptFunc.call(this, delta); 
            } catch (e) {
                console.error("Runtime Error:", e);
                Game.running = false; // Stop game on error
            }
        }
    }

    add_child(node) {
        node.parent = this;
        this.children.push(node);
        if (node.sceneObj) Game.scene.add(node.sceneObj);
        if (window.Editor) window.Editor.refreshTree();
    }
}

// ... (Rest of Game Object stays the same as before) ...
// Just ensure Game.running check triggers _ready on start

const Game = {
    // ... existing init code ...
    scene: null, camera: null, renderer: null,
    root: new Node("Root"),
    running: false,

    init: function(container) {
        // ... standard three.js setup from previous step ...
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(10, 10, 10); this.camera.lookAt(0,0,0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 100, 50);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));
        this.scene.add(new THREE.GridHelper(50, 50));

        this.clock = new THREE.Clock();
        this._animate();
    },

    _animate: function() {
        requestAnimationFrame(() => this._animate());
        const delta = this.clock.getDelta();

        if (this.running) {
            // First frame of running? Compile scripts.
            if (!this._hasStarted) {
                this._compileAll(this.root);
                this._hasStarted = true;
            }
            this._updateNode(this.root, delta);
        } else {
            this._hasStarted = false;
        }

        this.renderer.render(this.scene, this.camera);
    },

    _compileAll: function(node) {
        node._ready();
        node.children.forEach(c => this._compileAll(c));
    },

    _updateNode: function(node, delta) {
        node._process(delta);
        node.children.forEach(c => this._updateNode(c, delta));
    }
};

class CubeObj extends Node {
    constructor(name) {
        super(name);
        this.sceneObj = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color:0x00ff00}));
        this.export.y = 1;
    }
}
