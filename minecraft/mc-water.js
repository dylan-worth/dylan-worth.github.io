export let whirlpools = [];
export const WATER_LEVEL = -1;

export function spawnWhirlpools(scene, radius) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x0033aa, transparent:true, opacity:0.8 });
    for(let i=0; i<5; i++) {
        let wx = (Math.random()-0.5) * radius;
        let wz = (Math.random()-0.5) * radius;
        const geo = new THREE.PlaneGeometry(3, 3);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(wx, WATER_LEVEL + 0.1, wz);
        scene.add(mesh);
        whirlpools.push({ x: wx, z: wz, mesh: mesh });
    }
}

export function updateHydro(player, velocity, isInWater) {
    let inWhirlpool = false;
    let nearDanger = false;

    if (isInWater) {
        whirlpools.forEach(w => {
            w.mesh.rotation.z += 0.1; 
            const dx = player.position.x - w.x;
            const dz = player.position.z - w.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            if (dist < 2.5) {
                nearDanger = true;
                velocity.y -= 0.005; 
                player.rotation.y += 0.05;
                player.position.x -= dx * 0.03;
                player.position.z -= dz * 0.03;
                inWhirlpool = true;
            }
        });
        document.getElementById('danger-msg').style.display = nearDanger ? 'block' : 'none';
        
        // Buoyancy
        if (!inWhirlpool) {
            velocity.y -= 0.002; 
            velocity.y *= 0.9; 
        }
    } else {
        document.getElementById('danger-msg').style.display = 'none';
    }
    
    return inWhirlpool;
}
