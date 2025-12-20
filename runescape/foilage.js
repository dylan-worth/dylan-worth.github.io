import * as THREE from 'three';

export function createTree(scene, type, x, z) {
    const group = new THREE.Group();
    
    let trunkColor = 0x3d2817;
    let leafColor = 0x2d5a27;

    if (type === 'palm') {
        leafColor = 0x88aa00;
        // Tall thin trunk
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 5), new THREE.MeshStandardMaterial({color: trunkColor}));
        trunk.position.y = 2.5;
        group.add(trunk);
        // Palm leaves
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(3, 1, 6), new THREE.MeshStandardMaterial({color: leafColor}));
        leaves.position.y = 5;
        group.add(leaves);
    } 
    else if (type === 'oak') {
        // Thick trunk
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 3), new THREE.MeshStandardMaterial({color: trunkColor}));
        trunk.position.y = 1.5;
        group.add(trunk);
        // Round top
        const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(2), new THREE.MeshStandardMaterial({color: leafColor}));
        leaves.position.y = 3.5;
        group.add(leaves);
    }

    group.position.set(x, 0, z);
    scene.add(group);
    // Trees generally don't have collision in this simple demo, 
    // but you could call getColliders().push(...) here if you wanted.
}
