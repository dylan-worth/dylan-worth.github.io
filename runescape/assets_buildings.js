import * as THREE from 'three';

/**
 * Main building dispatcher.
 */
export function createBuilding(scene, type, x, z) {
    if (type === 'lum_castle') {
        return createCastle(scene, x, z);
    }

    // Standard building for shops/houses
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4, 6),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;
    
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
 * Generates the Large Expanded Castle with Front/Back openings and Occlusion Roof.
 */
function createCastle(scene, x, z) {
    const castleGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x4b3621, transparent: true, opacity: 0.9 });

    const wallHeight = 10;
    const thickness = 2;

    // 1. WALL SYSTEM (30x30 Footprint)
    // Defined as parts to allow for hollow interior and two door openings
    const walls = [
        { w: 30, h: wallHeight, d: thickness, px: 0, pz: -15 }, // Back Wall (Archway added later)
        { w: thickness, h: wallHeight, d: 30, px: -15, pz: 0 }, // Left Wall
        { w: thickness, h: wallHeight, d: 30, px: 15, pz: 0 },  // Right Wall
        // Front Walls (Leaving a gap for the door at x:0)
        { w: 12, h: wallHeight, d: thickness, px: -9, pz: 15 }, 
        { w: 12, h: wallHeight, d: thickness, px: 9, pz: 15 }
    ];

    walls.forEach(data => {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(data.w, data.h, data.d), stoneMat);
        wall.position.set(data.px, data.h / 2, data.pz);
        wall.castShadow = true;
        wall.receiveShadow = true;
        castleGroup.add(wall);
        
        // Add individual wall colliders
        const box = new THREE.Box3().setFromObject(wall);
        box.translate(new THREE.Vector3(x, 0, z));
        window.gameState.colliders.push(box);
    });

    // 2. THE ROOF (Tagged for Occlusion)
    // This mesh will be hidden by render.js when the player is inside
    const roof = new THREE.Mesh(new THREE.BoxGeometry(32, 1, 32), roofMat);
    roof.position.y = wallHeight;
    roof.userData.isCastleRoof = true; 
    castleGroup.add(roof);

    // 3. DOOR ARCHWAYS (Visual headers above openings)
    const frontHeader = new THREE.Mesh(new THREE.BoxGeometry(6, 3, thickness), stoneMat);
    frontHeader.position.set(0, wallHeight - 1.5, 15);
    
    const backHeader = new THREE.Mesh(new THREE.BoxGeometry(6, 3, thickness), stoneMat);
    backHeader.position.set(0, wallHeight - 1.5, -15);
    
    castleGroup.add(frontHeader, backHeader);

    // 4. CORNER TOWERS (Decorative)
    const towerPos = [
        {x:-15, z:-15}, {x:15, z:-15}, {x:-15, z:15}, {x:15, z:15}
    ];
    towerPos.forEach(p => {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 14, 8), stoneMat);
        tower.position.set(p.x, 7, p.z);
        const tRoof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 5, 8), roofMat);
        tRoof.position.set(p.x, 16.5, p.z);
        tRoof.userData.isCastleRoof = true;
        castleGroup.add(tower, tRoof);
    });

    castleGroup.position.set(x, 0, z);
    scene.add(castleGroup);
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
