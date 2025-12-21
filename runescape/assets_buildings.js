import * as THREE from 'three';

/**
 * Main building dispatcher.
 */
export function createBuilding(scene, type, x, z) {
    if (type === 'lum_castle') {
        return createCastle(scene, x, z);
    }

    // Standard building for Bob's Axes, Church, or General Stores
    const group = new THREE.Group();
    
    // Stone Body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4, 6),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;
    
    // Conical Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(5, 3, 4),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    roof.position.y = 5;
    roof.rotation.y = Math.PI / 4; // Align square base to body
    roof.castShadow = true;

    group.add(body, roof);
    group.position.set(x, 0, z);
    scene.add(group);
    
    // Add collision box
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}

/**
 * Generates a multi-part Castle based on the requested visual design.
 */
function createCastle(scene, x, z) {
    const castleGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x4b3621 }); // Dark brown / Wooden texture

    // 1. MAIN KEEP (Central Body)
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 12), stoneMat);
    mainBody.position.y = 4;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    castleGroup.add(mainBody);

    // 2. CORNER TOWERS (4 Cylindrical Towers)
    const towerPositions = [
        { x: -6, z: -6 }, { x: 6, z: -6 },
        { x: -6, z: 6 },  { x: 6, z: 6 }
    ];

    towerPositions.forEach(pos => {
        // Tower Shaft
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 8), stoneMat);
        tower.position.set(pos.x, 6, pos.z);
        tower.castShadow = true;
        tower.receiveShadow = true;
        
        // Tower Pointed Roof
        const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 8), roofMat);
        towerRoof.position.set(pos.x, 14, pos.z);
        towerRoof.castShadow = true;
        
        castleGroup.add(tower, towerRoof);
    });

    // 3. CENTRAL SPIRE (The High Peak)
    const centralSpire = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), stoneMat);
    centralSpire.position.y = 10;
    centralSpire.castShadow = true;

    const spireRoof = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 4), roofMat);
    spireRoof.position.y = 19;
    spireRoof.rotation.y = Math.PI / 4;
    spireRoof.castShadow = true;
    
    castleGroup.add(centralSpire, spireRoof);

    // 4. ENTRANCE GATEWAY
    const gate = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 1.5), stoneMat);
    gate.position.set(0, 2.5, 6); // Positioned at the front
    castleGroup.add(gate);

    // Set world position and add to scene
    castleGroup.position.set(x, 0, z);
    scene.add(castleGroup);

    // 5. COLLISION ZONE
    // Create a large box covering the castle footprint to prevent walking through it
    const castleCollider = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 5, z), 
        new THREE.Vector3(16, 20, 16)
    );
    window.gameState.colliders.push(castleCollider);
}

/**
 * Creates fences for boundaries.
 */
export function createFence(scene, x, z, length) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });

    // Main horizontal rail
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, 0.2), woodMat);
    rail.position.y = 0.8;
    
    // Support posts every 4 units
    const postCount = Math.floor(length / 4) + 1;
    for (let i = 0; i < postCount; i++) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), woodMat);
        post.position.x = -length / 2 + (i * 4);
        post.position.y = 0.6;
        group.add(post);
    }

    group.add(rail);
    group.position.set(x, 0, z);
    scene.add(group);
    
    // Collision for fence
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}
