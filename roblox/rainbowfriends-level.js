/* Rainbowfriends-level.js */

// --- MAP DATA (1 = Wall, 0 = Floor) ---
const mapLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const TILE_SIZE = 10;

// --- MODEL BUILDERS (Make them look "Realistic") ---

function createCharacterModel() {
    const group = new THREE.Group();
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.5, 0.5, 3);
    const legMat = new THREE.MeshStandardMaterial({color: 0x2c3e50});
    const leftLeg = new THREE.Mesh(legGeo, legMat); leftLeg.position.set(-0.8, 1.5, 0);
    const rightLeg = new THREE.Mesh(legGeo, legMat); rightLeg.position.set(0.8, 1.5, 0);
    
    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 1.5), new THREE.MeshStandardMaterial({color: 0xf1c40f}));
    torso.position.y = 4.5;

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), new THREE.MeshStandardMaterial({color: 0xffe0bd}));
    head.position.y = 7.5;

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.4, 0.4, 3);
    const leftArm = new THREE.Mesh(armGeo, legMat); leftArm.position.set(-1.8, 5, 0); leftArm.rotation.z = 0.2;
    const rightArm = new THREE.Mesh(armGeo, legMat); rightArm.position.set(1.8, 5, 0); rightArm.rotation.z = -0.2;

    group.add(leftLeg, rightLeg, torso, head, leftArm, rightArm);
    
    // BOX MODEL (Hidden by default)
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({color: 0x8d6e63}));
    boxMesh.position.y = 2;
    boxMesh.visible = false;
    boxMesh.name = "hidingBox";
    group.add(boxMesh);

    group.traverse(o => { if(o.isMesh) o.castShadow = true; });
    return group;
}

function createBlueMonster() {
    const group = new THREE.Group();
    
    // Body (Bulky)
    const bodyGeo = new THREE.CylinderGeometry(2.5, 3.5, 8, 12);
    const blueMat = new THREE.MeshStandardMaterial({color: 0x0984e3});
    const body = new THREE.Mesh(bodyGeo, blueMat);
    body.position.y = 4;

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(2.5), blueMat);
    head.position.y = 9;

    // Crown
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 8), new THREE.MeshStandardMaterial({color: 0xf1c40f}));
    crown.position.y = 11.5;

    // Eyes
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial({color:0xffffff}));
    eyeWhite.position.set(1, 9.5, 1.8);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color:0x000000}));
    pupil.position.set(1.1, 9.5, 2.5);
    
    // X-Eye (Button)
    const xEye1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color:0x000000}));
    xEye1.position.set(-1, 9.5, 2.2); xEye1.rotation.z = Math.PI/4;
    const xEye2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color:0x000000}));
    xEye2.position.set(-1, 9.5, 2.2); xEye2.rotation.z = -Math.PI/4;

    // Drool
    const drool = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), new THREE.MeshStandardMaterial({color: 0x74b9ff}));
    drool.position.set(0.5, 7.5, 2.2);

    // Arms (Long)
    const armGeo = new THREE.CylinderGeometry(0.8, 0.8, 7);
    const leftArm = new THREE.Mesh(armGeo, blueMat); leftArm.position.set(-3.5, 5, 0); leftArm.rotation.z = 0.3;
    const rightArm = new THREE.Mesh(armGeo, blueMat); rightArm.position.set(3.5, 5, 0); rightArm.rotation.z = -0.3;

    group.add(body, head, crown, eyeWhite, pupil, xEye1, xEye2, drool, leftArm, rightArm);
    group.traverse(o => { if(o.isMesh) o.castShadow = true; });
    return group;
}

function createRedCharacter() {
    const group = new THREE.Group();
    // Lab Coat
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 6), new THREE.MeshStandardMaterial({color: 0xc0392b})); // Red coat
    body.position.y = 3;
    
    // Head (Sci-fi)
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.8), new THREE.MeshStandardMaterial({color: 0xff0000})); // Red head
    head.position.y = 7;
    
    // Glasses
    const glass = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.5), new THREE.MeshStandardMaterial({color: 0x000000}));
    glass.position.set(0, 7.2, 1.5);

    group.add(body, head, glass);
    return group;
}

// --- GAME LOGIC ---

const Level = {
    walls: [],
    boxes: [],
    
    initMap: function(scene) {
        const wallGeo = new THREE.BoxGeometry(TILE_SIZE, 15, TILE_SIZE);
        const wallMat = new THREE.MeshStandardMaterial({color: 0x2d3436}); // Dark walls
        const floorGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({color: 0x636e72}); // Grey floor

        // Parse Grid
        for(let z=0; z<mapLayout.length; z++) {
            for(let x=0; x<mapLayout[z].length; x++) {
                const type = mapLayout[z][x];
                
                // Floor everywhere
                const floor = new THREE.Mesh(floorGeo, floorMat);
                floor.rotation.x = -Math.PI/2;
                floor.position.set(x*TILE_SIZE, 0, z*TILE_SIZE);
                scene.add(floor);

                if (type === 1) {
                    const wall = new THREE.Mesh(wallGeo, wallMat);
                    wall.position.set(x*TILE_SIZE, 7.5, z*TILE_SIZE);
                    wall.castShadow = true;
                    scene.add(wall);
                    this.walls.push(wall);
                } else if (Math.random() > 0.9) {
                    // Random Cardboard Box prop
                    const box = new THREE.Mesh(new THREE.BoxGeometry(3,3,3), new THREE.MeshStandardMaterial({color: 0xe67e22}));
                    box.position.set(x*TILE_SIZE, 1.5, z*TILE_SIZE);
                    scene.add(box);
                }
            }
        }
    },

    spawnCollectibles: function(scene) {
        let items = [];
        for(let i=0; i<5; i++) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color: 0x00b894, emissive: 0x00b894, emissiveIntensity: 0.5}));
            // Random free spot logic simplified
            let rx = Math.floor(Math.random() * mapLayout[0].length);
            let rz = Math.floor(Math.random() * mapLayout.length);
            while(mapLayout[rz][rx] === 1) {
                rx = Math.floor(Math.random() * mapLayout[0].length);
                rz = Math.floor(Math.random() * mapLayout.length);
            }
            b.position.set(rx*TILE_SIZE, 2, rz*TILE_SIZE);
            
            // Animation data
            b.userData = { yStart: 2 };
            scene.add(b);
            items.push(b);
        }
        return items;
    }
};

// --- CUTSCENE MANAGER ---
const Cutscene = {
    active: true,
    step: 0,
    
    start: function(camera, redChar, uiElement) {
        this.active = true;
        
        // Position Red
        redChar.position.set(50, 0, 50);
        redChar.lookAt(50, 0, 60);
        
        // Camera Focus on Red
        camera.position.set(50, 8, 65);
        camera.lookAt(50, 5, 50);

        // UI Text Sequence
        const textBox = document.getElementById('cutscene-text');
        uiElement.style.display = 'flex';
        
        setTimeout(() => textBox.innerText = "RED: Welcome to the facility...", 1000);
        setTimeout(() => textBox.innerText = "RED: My blocks have gone missing.", 3000);
        setTimeout(() => textBox.innerText = "RED: Avoid Blue. He isn't friendly.", 5000);
        setTimeout(() => {
            uiElement.style.display = 'none';
            this.active = false;
            // Reset Camera to player
        }, 7000);
    }
};
