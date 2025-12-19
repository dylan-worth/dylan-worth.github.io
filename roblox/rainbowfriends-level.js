/* Rainbowfriends-level.js */
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

function createCharacterModel() {
    const group = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.5, 0.5, 3);
    const legMat = new THREE.MeshStandardMaterial({color: 0x2c3e50});
    const leftLeg = new THREE.Mesh(legGeo, legMat); leftLeg.position.set(-0.8, 1.5, 0);
    const rightLeg = new THREE.Mesh(legGeo, legMat); rightLeg.position.set(0.8, 1.5, 0);
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 1.5), new THREE.MeshStandardMaterial({color: 0xf1c40f})); torso.position.y = 4.5;
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), new THREE.MeshStandardMaterial({color: 0xffe0bd})); head.position.y = 7.5;
    const armGeo = new THREE.CylinderGeometry(0.4, 0.4, 3);
    const leftArm = new THREE.Mesh(armGeo, legMat); leftArm.position.set(-1.8, 5, 0); leftArm.rotation.z = 0.2;
    const rightArm = new THREE.Mesh(armGeo, legMat); rightArm.position.set(1.8, 5, 0); rightArm.rotation.z = -0.2;
    group.add(leftLeg, rightLeg, torso, head, leftArm, rightArm);
    
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({color: 0x8d6e63}));
    boxMesh.position.y = 2; boxMesh.visible = false; boxMesh.name = "hidingBox";
    group.add(boxMesh);
    return group;
}

function createBlueMonster() {
    const group = new THREE.Group();
    const blueMat = new THREE.MeshStandardMaterial({color: 0x0984e3});
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.5, 8, 12), blueMat); body.position.y = 4;
    const head = new THREE.Mesh(new THREE.SphereGeometry(2.5), blueMat); head.position.y = 9;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 8), new THREE.MeshStandardMaterial({color: 0xf1c40f})); crown.position.y = 11.5;
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial({color:0xffffff})); eyeWhite.position.set(1, 9.5, 1.8);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color:0x000000})); pupil.position.set(1.1, 9.5, 2.5);
    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2), new THREE.MeshBasicMaterial({color:0x000000})); button.rotation.x = Math.PI/2; button.position.set(-1, 9.5, 2.2);
    group.add(body, head, crown, eyeWhite, pupil, button);
    return group;
}

function createRedCharacter() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 6), new THREE.MeshStandardMaterial({color: 0xc0392b})); body.position.y = 3;
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.8), new THREE.MeshStandardMaterial({color: 0xff0000})); head.position.y = 7;
    const eyes = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.5), new THREE.MeshStandardMaterial({color: 0x000000})); eyes.position.set(0, 7.2, 1.5);
    group.add(body, head, eyes);
    return group;
}

const Level = {
    initMap: function(scene) {
        const wallGeo = new THREE.BoxGeometry(TILE_SIZE, 15, TILE_SIZE);
        const wallMat = new THREE.MeshStandardMaterial({color: 0x555555}); 
        const floorGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({color: 0x888888});

        for(let z=0; z<mapLayout.length; z++) {
            for(let x=0; x<mapLayout[z].length; x++) {
                const floor = new THREE.Mesh(floorGeo, floorMat); floor.rotation.x = -Math.PI/2; floor.position.set(x*TILE_SIZE, 0, z*TILE_SIZE); scene.add(floor);
                if (mapLayout[z][x] === 1) {
                    const wall = new THREE.Mesh(wallGeo, wallMat); wall.position.set(x*TILE_SIZE, 7.5, z*TILE_SIZE); scene.add(wall);
                }
            }
        }
    },
    spawnCollectibles: function(scene) {
        let items = [];
        for(let i=0; i<5; i++) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color: 0x00b894}));
            let rx = 1, rz = 1;
            while(mapLayout[rz][rx] === 1) { rx = Math.floor(Math.random()*mapLayout[0].length); rz = Math.floor(Math.random()*mapLayout.length); }
            b.position.set(rx*TILE_SIZE, 2, rz*TILE_SIZE);
            scene.add(b); items.push(b);
        }
        return items;
    }
};
