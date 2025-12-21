import * as THREE from 'three';

export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1.5, 2, 1.5)));

    if (type === 'bank_booth') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75;
        group.add(mesh);
    } else if (type === 'shop_stall') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5;
        group.add(mesh);
    }
    group.position.set(x, 0, z);
    group.userData = { type: type };
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

export function createTree(scene, type, x, z) {
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1)));
    const group = new THREE.Group();
    
    let color = 0x228b22, name="Tree", req=1, xp=25;
    if(type==='oak'){color=0x116611; name="Oak"; req=15; xp=37;}

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y=1;
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({color:color}));
    leaves.position.y=2.5;
    
    group.add(trunk,leaves);
    group.position.set(x,0,z);
    
    group.userData={type:'tree', treeName:name, levelReq:req, xp:xp, respawning:false};
    trunk.userData={parentGroup:group};
    leaves.userData={parentGroup:group};
    scene.add(group);
}

export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    
    let bodyColor, headColor, hp, maxHp, combatLvl, name;
    let isWoman = (type === 'woman');

    if (type === 'man') {
        bodyColor = 0x445588; headColor = 0xffccaa; hp = 7; maxHp = 7; combatLvl = 2; name = "Man";
    } 
    else if (type === 'woman') {
        bodyColor = 0x884488; headColor = 0xffccaa; hp = 7; maxHp = 7; combatLvl = 2; name = "Woman";
    }
    else if (type === 'goblin') {
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
