import * as THREE from 'three';

/**
 * Creates NPCs, including the unique Hans character with custom styling and dialogue.
 */
export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    
    // 1. BODY (SHIRT) 
    // Hans wears a Maroon shirt (0x800000), others wear standard blue.
    const bodyColor = (type === 'hans') ? 0x800000 : 0x445588; 
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.4),
        new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    body.position.y = 0.4;
    body.castShadow = true;

    // 2. HEAD
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffccaa })
    );
    head.position.y = 1.0;
    head.castShadow = true;

    // 3. HAIR (Unique to Hans - Brown)
    if (type === 'hans') {
        const hair = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.1, 0.32),
            new THREE.MeshStandardMaterial({ color: 0x4b3621 }) 
        );
        hair.position.y = 1.15;
        group.add(hair);
    }

    group.add(body, head);
    group.position.set(x, 0, z);
    
    // 4. METADATA & DIALOGUE
    group.userData = { 
        type: 'npc', 
        npcType: type, 
        name: type === 'hans' ? 'Hans' : (type === 'cook' ? 'Cook' : 'Man'),
        hp: 10,
        maxHp: 10,
        parentGroup: group,
        onInteract: () => {
            if (type === 'hans') {
                const lines = [
                    "Hans: I've been here for a long time... watching the castle grow.",
                    "Hans: I've seen many adventurers come and go, but I remain.",
                    "Hans: Welcome! It's a fine day to be in Lumbridge."
                ];
                return lines[Math.floor(Math.random() * lines.length)];
            }
            return null;
        }
    };
    
    scene.add(group);
    return group;
}

/**
 * Creates interactable world objects like Bank Booths or Chests.
 */
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    let mesh;

    if (type === 'bank_booth') {
        mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 1),
            new THREE.MeshStandardMaterial({ color: 0x5c4033 })
        );
    } else {
        mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff00ff })
        );
    }

    mesh.position.y = 1;
    group.add(mesh);
    group.position.set(x, 0, z);
    group.userData = { type: type, name: type.replace('_', ' '), parentGroup: group };
    
    scene.add(group);
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}

/**
 * Creates trees for the Woodcutting skill.
 */
export function createTree(scene, type, x, z) {
    const group = new THREE.Group();
    
    // Trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c4033 })
    );
    trunk.position.y = 1;
    
    // Leaves
    const leafColor = type === 'oak' ? 0x224422 : 0x2d5a27;
    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 8, 8),
        new THREE.MeshStandardMaterial({ color: leafColor })
    );
    leaves.position.y = 2.5;

    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    group.userData = { type: 'tree', name: type, xp: type === 'oak' ? 37 : 25, parentGroup: group };
    
    scene.add(group);
    window.gameState.colliders.push(new THREE.Box3().setFromObject(group));
}

/**
 * Miscellaneous props (Chess Tables, Snow, Lanterns).
 */
export function createChessTable(scene, x, z) {
    const group = new THREE.Group();
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), new THREE.MeshStandardMaterial({color: 0x444444}));
    table.position.y = 0.5;
    group.add(table);
    group.position.set(x, 0, z);
    group.userData = { type: 'chess_table', parentGroup: group };
    scene.add(group);
}

export function createSnowPile(scene, x, z) {
    const group = new THREE.Group();
    const snow = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 4), new THREE.MeshStandardMaterial({color: 0xffffff}));
    snow.scale.y = 0.3;
    group.add(snow);
    group.position.set(x, 0, z);
    group.userData = { type: 'snow_pile', parentGroup: group };
    scene.add(group);
}

export function createLantern(scene, x, z) {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), new THREE.MeshStandardMaterial({color: 0x111111}));
    pole.position.y = 2;
    
    const light = new THREE.PointLight(0xffaa00, 0, 10);
    light.position.y = 4;
    window.gameState.lanternLights.push(light);

    group.add(pole, light);
    group.position.set(x, 0, z);
    scene.add(group);
}
