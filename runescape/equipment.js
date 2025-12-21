import * as THREE from 'three';
import { playerHand } from './render.js';
import { addChatMessage } from './chat.js';

let currentEquip = null;

export function equipItem(itemId) {
    if (!playerHand) return;

    // 1. Clear previous item
    while(playerHand.children.length > 0){ 
        playerHand.remove(playerHand.children[0]); 
    }
    
    currentEquip = itemId;

    // 2. Create Geometry based on item ID
    let mesh = null;

    if (itemId.includes('axe')) {
        // Simple Axe Model
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), new THREE.MeshStandardMaterial({color: 0x5c4033}));
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), new THREE.MeshStandardMaterial({color: 0x888888}));
        head.position.y = 0.3;
        mesh = new THREE.Group();
        mesh.add(handle, head);
        
        // Rotate to look like holding
        mesh.rotation.x = Math.PI / 2; 
    } 
    else if (itemId === 'sword') {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), new THREE.MeshStandardMaterial({color: 0xcccccc}));
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), new THREE.MeshStandardMaterial({color: 0x888888}));
        guard.position.y = -0.3;
        blade.position.y = 0.1;
        mesh = new THREE.Group();
        mesh.add(blade, guard);
        mesh.rotation.x = Math.PI / 2;
    }
    else if (itemId === 'chef_hat') {
        // Special Case: Hat goes on head (Simulated by floating high for now or attached to head if we exported head)
        // For simplicity, we'll just put it in hand as a trophy or skip visuals
        addChatMessage("You put on the Chef's Hat!", "white");
        return; 
    }

    // 3. Attach
    if (mesh) {
        playerHand.add(mesh);
        addChatMessage(`Equipped: ${itemId}`, "lime");
    }
}
