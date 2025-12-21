import * as THREE from 'three';

/**
 * Main building dispatcher.
 */
export function createBuilding(scene, type, x, z) {
    if (type === 'lum_castle') {
        return createCastle(scene, x, z);
    }

    // Standard building (Bob's Axes, Church, etc.)
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
    roof.rotation.y = Math.PI / 4; 
    roof.castShadow = true;

    group.add(body, roof);
    group.position.set(x, 0, z);
    scene.add(group);
    
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}

/**
 * Generates the Upgraded Castle with an accessible entrance.
 */
function createCastle(scene, x, z) {
    const castleGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x4b3621 }); // Dark brown wooden roof

    // 1. MAIN KEEP (Broken into walls to allow internal access)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 2), stoneMat);
    backWall.position.set(0, 4, -5);
    
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 12), stoneMat);
    leftWall.position.set(-5, 4, 0);
    
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 12), stoneMat);
    rightWall.position.set(5, 4, 0);
    
    // Front walls (leaving a 4-unit gap for the door)
    const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(4, 8, 2), stoneMat);
    frontWallL.position.set(-4, 4, 5);
    
    const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(4, 8, 2), stoneMat);
    frontWallR.position.set(4, 4, 5);
    
    // Header above the gate
    const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 2), stoneMat);
    doorHeader.position.set(0, 6.5, 5);
    
    castleGroup.add(backWall, leftWall, rightWall, frontWallL, frontWallR, doorHeader);

    // 2. CORNER TOWERS
    const towerPositions = [
        { x: -6, z: -6 }, { x: 6, z: -6 },
        { x: -6, z: 6 },  { x: 6, z: 6 }
    ];

    towerPositions.forEach(pos => {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 8), stoneMat);
        tower.position.set(pos.x, 6, pos.z);
        tower.castShadow = true;
        
        const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 8), roofMat);
        towerRoof.position.set(pos.x, 14, pos.z);
        towerRoof.castShadow = true;
        
        castleGroup.add(tower, towerRoof);
    });

    // 3. CENTRAL SPIRE
    const centralSpire = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), stoneMat);
    centralSpire.position.y = 10;
    
    const spireRoof = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 4), roofMat);
    spireRoof.position.y = 19;
    spireRoof.rotation.y = Math.PI / 4;
    
    castleGroup.add(centralSpire, spireRoof);

    // 4. SET POSITION & ADD TO SCENE
    castleGroup.position.set(x, 0, z);
    scene.add(castleGroup);

    // 5. COLLISIONS (Added per wall to allow the player to enter the center)
    const walls = [backWall, leftWall, rightWall, frontWallL, frontWallR];
    walls.forEach(wall => {
        const box = new THREE.Box3().setFromObject(wall);
        // Translate the local wall bounds to the castle's world position
        box.translate(new THREE.Vector3(x, 0, z));
        window.gameState.colliders.push(box);
    });
}

/**
 * Creates fences for boundaries.
 */
export function createFence(scene, x, z, length) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });

    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, 0.2), woodMat);
    rail.position.y = 0.8;
    
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
    
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}
