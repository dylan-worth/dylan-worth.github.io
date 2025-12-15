export let mobs = [];
const mobMats = {
    crab: new THREE.MeshLambertMaterial({color: 0xff4400}),
    fish: new THREE.MeshLambertMaterial({color: 0xffaa00}),
    bird: new THREE.MeshBasicMaterial({color: 0xffffff})
};

export function spawnMob(scene, type, x, y, z) {
    const mob = new THREE.Group();
    let geo;
    if(type === 'crab') geo = new THREE.BoxGeometry(0.4, 0.2, 0.3);
    else if(type === 'fish') geo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    else geo = new THREE.BoxGeometry(0.2, 0.1, 0.2); 

    const body = new THREE.Mesh(geo, mobMats[type]);
    mob.add(body);
    mob.position.set(x, y, z);
    mob.userData = { type: type, speed: 0.02 + Math.random()*0.02, offset: Math.random()*100, anchor: new THREE.Vector3(x,y,z) };
    
    scene.add(mob);
    mobs.push(mob);
}

export function updateMobs() {
    const time = Date.now() * 0.001;
    mobs.forEach(m => {
        if (m.userData.type === 'fish') {
            m.position.x = m.userData.anchor.x + Math.sin(time + m.userData.offset) * 2;
            m.position.z = m.userData.anchor.z + Math.cos(time + m.userData.offset) * 2;
            m.rotation.y = -(time + m.userData.offset);
        } else if (m.userData.type === 'crab') {
            m.position.x = m.userData.anchor.x + Math.sin(time * 2 + m.userData.offset) * 0.5;
        } else if (m.userData.type === 'bird') {
            m.position.x = m.userData.anchor.x + Math.sin(time + m.userData.offset) * 15;
            m.position.z = m.userData.anchor.z + Math.cos(time + m.userData.offset) * 15;
            m.rotation.y = -(time + m.userData.offset);
        }
    });
}
