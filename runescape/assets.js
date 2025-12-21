import * as THREE from 'three';

// --- GROUND GENERATION ---
export function createGround(scene, colorHex) {
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground"; // Required for click-to-move raycasting
    scene.add(mesh);
}

// --- INTERACTABLES (Banks, Shops) ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    
    if (type === 'bank_booth') {
        // Wooden Counter
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1.5, 1), 
            new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        base.position.y = 0.75;
        base.castShadow = true;
        group.add(base);
        
        // Glass Partition
        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1, 0.1), 
            new THREE.MeshStandardMaterial({ color: 0x88ccff, opacity: 0.6, transparent: true })
        );
        glass.position.set(0, 2, 0);
        group.add(glass);
    } 
    else if (type === 'shop_stall') {
        // Stall Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3, 1, 2), 
            new THREE.MeshStandardMaterial({ color: 0x880000 })
        );
        base.position.y = 0.5;
        base.castShadow = true;
        group.add(base);
        
        // Striped Roof (Cylinder cut in half)
        const roof = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 3.2, 8, 1, false, 0, Math.PI), 
            new THREE.MeshStandardMaterial({ color: 0xeeeeee })
        );
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 2.5;
        group.add(roof);

        // Posts holding roof
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), new THREE.MeshStandardMaterial({color: 0x654321}));
        postL.position.set(-1.4, 1.5, 0);
        group.add(postL);
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), new THREE.MeshStandardMaterial({color: 0x654321}));
        postR.position.set(1.4, 1.5, 0);
        group.add(postR);
    }

    group.position.set(x, 0, z);
    
    // DATA FOR MAIN.JS RAYCASTER
    group.userData = { type: type };
    // Helper: make sure clicking children triggers the group logic
    group.traverse((child) => {
        if(child.isMesh) child.userData = { parentGroup: group };
    });
    
    scene.add(group);
}

// --- BUILDINGS (Walls, Castles, Pyramids) ---
export function createBuilding(scene, type, x, z, rotY = 0) {
    const group = new THREE.Group();

    if (type === 'lum_castle') {
        // Main Keep (Grey)
        const keep = new THREE.Mesh(
            new THREE.BoxGeometry(10, 8, 10), 
            new THREE.MeshStandardMaterial({ color: 0x777777 })
        );
        keep.position.y = 4;
        keep.castShadow = true;
        keep.receiveShadow = true;
        group.add(keep);
        
        // Battlements (Top rim)
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(11, 1, 11), 
            new THREE.MeshStandardMaterial({ color: 0x666666 })
        );
        top.position.y = 8.5;
        group.add(top);
    }
    else if (type === 'white_castle') {
        // Falador White Walls
        const keep = new THREE.Mesh(
            new THREE.BoxGeometry(12, 10, 8), 
            new THREE.MeshStandardMaterial({ color: 0xeeeeee })
        );
        keep.position.y = 5;
        keep.castShadow = true;
        group.add(keep);
        
        // Drawbridge / Entrance
        const bridge = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.5, 6), 
            new THREE.MeshStandardMaterial({ color: 0x444444 })
        );
        bridge.position.set(0, 0.25, 6);
        group.add(bridge);
        
        // Blue Flags (Falador colors)
        const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), new THREE.MeshStandardMaterial({color: 0x888888}));
        flagPole.position.set(5, 12, 0);
        group.add(flagPole);
        const flag = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.1), new THREE.MeshStandardMaterial({color: 0x0000ff}));
        flag.position.set(5.5, 13.5, 0);
        group.add(flag);
    }
    else if (type === 'pyramid') {
        // Menaphos Sandstone Pyramid
        const pyr = new THREE.Mesh(
            new THREE.ConeGeometry(12, 15, 4), 
            new THREE.MeshStandardMaterial({ color: 0xd2b48c })
        );
        pyr.rotation.y = Math.PI / 4; // Rotate to look square
        pyr.position.y = 7.5;
        pyr.castShadow = true;
        group.add(pyr);
        
        // Gold Cap
        const cap = new THREE.Mesh(
            new THREE.ConeGeometry(3, 4, 4),
            new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5, roughness: 0.2 })
        );
        cap.rotation.y = Math.PI / 4;
        cap.position.y = 14;
        group.add(cap);
    }
    else if (type === 'church') {
        // Main Hall
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(6, 5, 8), 
            new THREE.MeshStandardMaterial({ color: 0x555555 })
        );
        body.position.y = 2.5;
        body.castShadow = true;
        group.add(body);
        
        // Bell Tower
        const tower = new THREE.Mesh(
            new THREE.BoxGeometry(3, 10, 3), 
            new THREE.MeshStandardMaterial({ color: 0x555555 })
        );
        tower.position.set(0, 5, 3.5);
        tower.castShadow = true;
        group.add(tower);
        
        // Stained Glass Window (Blue)
        const window = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 3),
            new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide })
        );
        window.position.set(0, 5, 5.1);
        group.add(window);
    }

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);
}

// --- TREES (Woodcutting Nodes) ---
export function createTree(scene, type, x, z) {
    const group = new THREE.Group();
    
    let trunkColor = 0x3d2817;
    let leafColor = 0x228b22;
    let trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 2);
    let leafGeo = new THREE.DodecahedronGeometry(1.5);
    
    // --- STATS CONFIGURATION ---
    let name = "Tree";
    let levelReq = 1;
    let xp = 25;
    let difficulty = 10; // Lower is easier to chop

    if (type === 'oak') {
        name = "Oak Tree";
        levelReq = 15;
        xp = 37.5;
        difficulty = 25; 
        
        // Visuals: Thicker, darker
        trunkGeo = new THREE.CylinderGeometry(0.8, 1.0, 2.5);
        leafGeo = new THREE.DodecahedronGeometry(2.2);
    }
    else if (type === 'palm') {
        name = "Palm Tree";
        levelReq = 30; // Making Palms higher level for Menaphos
        xp = 60;
        difficulty = 40;

        // Visuals: Tall, thin, green canopy
        leafColor = 0x88aa00;
        trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 4);
        leafGeo = new THREE.ConeGeometry(3, 1.5, 6);
    }

    // Build Mesh
    const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({color: trunkColor}));
    trunk.position.y = (type==='palm') ? 2 : 1;
    trunk.castShadow = true;
    
    const leaves = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({color: leafColor}));
    leaves.position.y = (type==='palm') ? 4 : 2.5;

    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    // DATA FOR MAIN.JS LOGIC
    group.userData = { 
        type: 'tree', 
        treeName: name, 
        levelReq: levelReq,
        xp: xp,
        difficulty: difficulty,
        respawning: false 
    };
    
    // Helper for Raycaster
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };

    scene.add(group);
}
