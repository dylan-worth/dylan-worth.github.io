/* engine.js - WebGodot Core v1.0 */

// --- BASE NODE ---
class Node {
    constructor(name) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name || "Node";
        this.children = [];
        this.parent = null;
        this.sceneObj = null;
        this.script = ""; 
        this._scriptFunc = null;

        // Serialized Properties (Saved to JSON)
        this.export = {
            x: 0, y: 0, z: 0,
            rx: 0, ry: 0, rz: 0, // Rotation
            sx: 1, sy: 1, sz: 1, // Scale
            visible: true,
            color: "#ffffff" // Asset Color
        };
    }

    _ready() {
        if (this.script && this.script.trim() !== "") {
            try { this._scriptFunc = new Function('delta', 'log', this.script); } 
            catch (e) { console.error("Script Compile Error:", e); }
        }
    }
    
    _process(delta) {
        // Sync Editor Props to Visuals
        if (this.sceneObj) {
            this.sceneObj.position.set(this.export.x, this.export.y, this.export.z);
            this.sceneObj.rotation.set(this.export.rx, this.export.ry, this.export.rz);
            this.sceneObj.scale.set(this.export.sx, this.export.sy, this.export.sz);
            this.sceneObj.visible = this.export.visible;
            
            // Dynamic Color Update
            if(this.sceneObj.material && this.sceneObj.material.color) {
                this.sceneObj.material.color.set(this.export.color);
            }
        }

        // RUN USER SCRIPT
        if (Game.running && this._scriptFunc) {
            try { this._scriptFunc.call(this, delta, Game.log); } 
            catch (e) { 
                Game.log("Error in " + this.name + ": " + e.message, "error");
                Game.running = false; 
            }
        }
    }

    add_child(node) {
        node.parent = this;
        this.children.push(node);
        if (node.sceneObj) Game.scene.add(node.sceneObj);
        if (window.Editor) window.Editor.refreshTree();
    }

    // --- SAVING SYSTEM ---
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            script: this.script,
            export: this.export,
            children: this.children.map(c => c.toJSON())
        };
    }

    static fromJSON(data) {
        // Simple factory for now
        let node;
        if(data.name.includes("Cube")) node = new CubeObj(data.name);
        else node = new Node(data.name);
        
        node.id = data.id;
        node.script = data.script;
        node.export = data.export;
        data.children.forEach(cData => {
            const child = Node.fromJSON(cData);
            node.add_child(child);
        });
        return node;
    }
}

// --- GAME SINGLETON ---
const Game = {
    scene: null, camera: null, renderer: null,
    root: new Node("Root"),
    running: false,
    onLog: null, // Hook for Editor Console

    init: function(container) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        this.scene.fog = new THREE.Fog(0x222222, 20, 100);

        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(8, 8, 8); this.camera.lookAt(0,0,0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 100, 50);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));
        this.scene.add(new THREE.GridHelper(50, 50));

        this.clock = new THREE.Clock();
        this._animate();
    },

    log: function(msg, type="info") {
        if(Game.onLog) Game.onLog(msg, type);
        else console.log(`[${type}] ${msg}`);
    },

    saveScene: function() {
        const json = JSON.stringify(this.root.toJSON());
        localStorage.setItem('webgodot_save', json);
        this.log("Scene Saved!", "success");
    },

    loadScene: function() {
        const json = localStorage.getItem('webgodot_save');
        if(!json) return this.log("No save found!", "error");
        
        // Clear current
        while(this.root.children.length > 0) {
            const c = this.root.children.pop();
            if(c.sceneObj) this.scene.remove(c.sceneObj);
        }
        
        // Load new
        const data = JSON.parse(json);
        data.children.forEach(cData => {
            const child = Node.fromJSON(cData);
            this.root.add_child(child);
        });
        this.log("Scene Loaded!", "success");
    },

    _animate: function() {
        requestAnimationFrame(() => this._animate());
        const delta = this.clock.getDelta();

        if (this.running) {
            if (!this._hasStarted) { this._compileAll(this.root); this._hasStarted = true; }
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
        this.export.color = "#00ff00";
    }
}
