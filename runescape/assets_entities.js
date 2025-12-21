import * as THREE from 'three';

window.gameState = window.gameState || {};
window.gameState.colliders = window.gameState.colliders || [];

// --- HELPER: CHESS TEXTURE ---
function getChessTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eecfa1'; ctx.fillRect(0,0,64,64); // Light
    ctx.fillStyle = '#5c4033'; // Dark
    for(let y=0; y<8; y++){
        for(let x=0; x<8; x++){
            if((x+y)%2===1) ctx.fillRect(x*8, y*8, 8, 8);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; 
    return tex;
}

// --- SNOW OBJECTS ---

export function createSnowPile(scene, x, z) {
    const geo = new THREE.SphereGeometry(1, 8, 6, 0, Math.PI * 2, 0, Math.PI/2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pile = new THREE.Mesh(geo, mat);
    pile.position.set(x, 0, z);
    pile.scale.y = 0.5; // Flatten into a mound
    
    const group = new THREE.Group();
    group.add(pile);
    group.position.set(x, 0, z); // Position group correctly

    // Interaction Data
    group.userData = { type: 'snow_pile', name: "Snow Pile" };
    pile.userData = { parentGroup: group };
    
    scene.add(group);
}

export function createSnowman(scene, x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    // 3 Snowballs
    const bot = new THREE.Mesh(new THREE.SphereGeometry(0.6), mat); bot.position.y = 0.6;
    const mid = new THREE.Mesh(new THREE.SphereGeometry(0.4), mat); mid.position.y = 1.4;
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.3), mat); top.position.y = 2.0;
    
    // Stick Arms
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), stickMat);
    arm.position.y = 1.4;

    group.add(bot, mid, top, arm);
    group.position.set(x, 0, z);
    
    // Collision
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 2, 1)
    ));
    scene.add(group);
}

// --- FURNITURE (Chess) ---

export function createChessTable(scene, x, z) {
    const group = new THREE.Group();
    
    const topGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const topMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.8;

    const legGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const p1 = new THREE.Mesh(legGeo, topMat); p1.position.set(-0.5, 0.4, -0.5);
    const p2 = new THREE.Mesh(legGeo, topMat); p2.position.set(0.5, 0.4, -0.5);
    const p3 = new THREE.Mesh(legGeo, topMat); p3.position.set(-0.5, 0.4, 0.5);
    const p4 = new THREE.Mesh(legGeo, topMat); p4.position.set(0.5, 0.4, 0.5);

    const board = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.8), 
        new THREE.MeshStandardMaterial({ map: getChessTexture() })
    );
    board.rotation.x = -Math.PI/2;
    board.position.y = 0.86;

    group.add(top, p1, p2, p3, p4, board);
    group.position.set(x, 0, z);
    
    group.userData = { type: 'chess_table', name: "Chess Table" };
    group.children.forEach(c => c.userData = { parentGroup: group });

    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 0.5, z), new THREE.Vector3(1.2, 1, 1.2)
    ));

    scene.add(group);
}

// --- INTERACTABLES (Banks, Shops) ---

export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), new THREE.Vector3(1.5, 2, 1.5)
    ));

    if (type === 'bank_booth') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75; group.add(mesh);
    } else if (type === 'shop_stall') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5; group.add(mesh);
    }
    
    group.position.set(x, 0, z);
    group.userData = { type: type, name: type === 'bank_booth' ? "Bank" : "Shop" };
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

// --- TREES ---

export function createTree(scene, type, x, z) {
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1)
    ));
    
    const group = new THREE.Group();
    let color = 0x228b22, name = "Tree", req = 1, xp = 25;
    if(type === 'oak'){ color = 0x116611; name = "Oak"; req = 15; xp = 37.5; }

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y = 1;
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({color: color}));
    leaves.position.y = 2.5;
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    group.userData = { type: 'tree', treeName: name, levelReq: req, xp: xp, respawning: false };
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };
    scene.add(group);
}

// --- NPCS ---

export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    let bodyColor, headColor, hp, maxHp, combatLvl, name;
    let isWoman = (type === 'woman');

    if (type === 'man') {
        bodyColor = 0x445588; headColor = 0xffccaa; hp = 7; maxHp = 7; combatLvl = 2; name = "Man";
    } else if (type === 'woman') {
        bodyColor = 0x884488; headColor = 0xffccaa; hp = 7; maxHp = 7; combatLvl = 2; name = "Woman";
    } else if (type === 'goblin') {
        bodyColor = 0x558855; headColor = 0x00ff00; hp = 5; maxHp = 5; combatLvl = 2; name = "Goblin";
    }

    let body;
    if (isWoman) {
        body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.8), new THREE.MeshStandardMaterial({color: bodyColor}));
    } else {
        body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: bodyColor}));
    }
    body.position.y = 0.8;
    
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: headColor}));
    head.position.y = 1.4;

    group.add(body, head);
    group.position.set(x, 0, z);
    
    group.userData = { type: 'npc', npcType: type, name: name, hp: hp, maxHp: maxHp, combatLevel: combatLvl };
    body.userData = { parentGroup: group };
    head.userData = { parentGroup: group };
    scene.add(group);
}
