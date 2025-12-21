import * as THREE from 'three';

window.gameState = window.gameState || {};
window.gameState.colliders = window.gameState.colliders || [];

// --- HELPER: CHESS TEXTURE ---
function getChessTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eecfa1'; ctx.fillRect(0,0,64,64); 
    ctx.fillStyle = '#5c4033'; 
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
    pile.scale.y = 0.5; 
    
    const group = new THREE.Group();
    group.add(pile);
    group.position.set(x, 0, z);
    group.userData = { type: 'snow_pile', name: "Snow Pile" };
    pile.userData = { parentGroup: group };
    scene.add(group);
}

export function createSnowman(scene, x, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const bot = new THREE.Mesh(new THREE.SphereGeometry(0.6), mat); bot.position.y = 0.6;
    const mid = new THREE.Mesh(new THREE.SphereGeometry(0.4), mat); mid.position.y = 1.4;
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.3), mat); top.position.y = 2.0;
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), stickMat);
    arm.position.y = 1.4;
    group.add(bot, mid, top, arm);
    group.position.set(x, 0, z);
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 2, 1)));
    scene.add(group);
}

// --- FURNITURE ---
export function createChessTable(scene, x, z) {
    const group = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
    top.position.y = 0.8;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({ map: getChessTexture() }));
    board.rotation.x = -Math.PI/2;
    board.position.y = 0.86;
    group.add(top, board);
    group.position.set(x, 0, z);
    group.userData = { type: 'chess_table', name: "Chess Table" };
    group.children.forEach(c => c.userData = { parentGroup: group });
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(1.2, 1, 1.2)));
    scene.add(group);
}

// --- INTERACTABLES ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1.5, 2, 1.5)));
    let mesh;
    if (type === 'bank_booth') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75; 
    } else if (type === 'shop_stall') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5; 
    }
    group.add(mesh);
    group.position.set(x, 0, z);
    group.userData = { type: type, name: type === 'bank_booth' ? "Bank" : "Shop" };
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

// --- TREES ---
export function createTree(scene, type, x, z) {
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1)));
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
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

// --- NPCS (Updated with Cows/Chickens) ---
export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    let bodyColor=0x445588, headColor=0xffccaa, hp=7, name="Man", scale=1;
    let isAnimal = false;
    let npcTypeOverride = 'npc'; // Default to attackable

    if (type === 'man') { bodyColor=0x445588; name="Man"; }
    else if (type === 'woman') { bodyColor=0x884488; name="Woman"; }
    else if (type === 'goblin') { bodyColor=0x558855; headColor=0x00ff00; name="Goblin"; hp=5; }
    
    // QUEST NPCS
    else if (type === 'cook') { 
        bodyColor=0xffffff; name="Cook"; npcTypeOverride='quest_npc'; 
    }
    else if (type === 'cow') { 
        bodyColor=0x222222; headColor=0xffffff; name="Cow"; isAnimal=true; npcTypeOverride='quest_npc';
    }
    else if (type === 'chicken') { 
        bodyColor=0xccaa88; headColor=0xcc0000; name="Chicken"; isAnimal=true; npcTypeOverride='quest_npc';
    }

    let body, head;
    if (isAnimal && type === 'cow') {
        // Cow Shape
        body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 2), new THREE.MeshStandardMaterial({color: bodyColor}));
        body.position.y = 0.5;
        head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({color: headColor}));
        head.position.set(0, 1, 1);
    } 
    else if (isAnimal && type === 'chicken') {
        // Chicken Shape
        body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.5), new THREE.MeshStandardMaterial({color: bodyColor}));
        body.position.y = 0.2;
        head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({color: headColor}));
        head.position.set(0, 0.5, 0.2);
    } 
    else {
        // Humanoid
        body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: bodyColor}));
        body.position.y = 0.8;
        head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: headColor}));
        head.position.y = 1.4;
    }

    group.add(body, head);
    group.position.set(x, 0, z);
    
    // CRITICAL: Set the types correctly so Main.js knows how to interact
    group.userData = { 
        type: npcTypeOverride, // 'npc' or 'quest_npc'
        npcType: type,         // 'man', 'cow', etc
        name: name, 
        hp: hp, 
        maxHp: hp 
    };
    
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
    return group;
}
