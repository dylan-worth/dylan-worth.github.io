import * as THREE from 'three';
import { playerHand, playerGroup } from './render.js';
import { addChatMessage } from './chat.js';

let currentEquip = null;

export function equipItem(itemId) {
    if (!playerHand) return;

    // --- WEAPONS (Right Hand) ---
    if (itemId.includes('axe') || itemId.includes('sword')) {
        // Clear previous hand items
        while(playerHand.children.length > 0){ playerHand.remove(playerHand.children[0]); }
        
        let mesh = null;
        if (itemId.includes('axe')) {
            const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), new THREE.MeshStandardMaterial({color: 0x5c4033}));
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), new THREE.MeshStandardMaterial({color: 0x888888}));
            head.position.y = 0.3;
            mesh = new THREE.Group(); mesh.add(handle, head); mesh.rotation.x = Math.PI / 2; 
        } 
        else if (itemId === 'sword') {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), new THREE.MeshStandardMaterial({color: 0xcccccc}));
            const guard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), new THREE.MeshStandardMaterial({color: 0x888888}));
            guard.position.y = -0.3; blade.position.y = 0.1;
            mesh = new THREE.Group(); mesh.add(blade, guard); mesh.rotation.x = Math.PI / 2;
        }

        if (mesh) {
            playerHand.add(mesh);
            addChatMessage(`Equipped: ${itemId}`, "lime");
        }
    }

    // --- HATS (Head) ---
    else if (itemId === 'santa_hat') {
        // Try to attach to head (Index 1 of playerGroup)
        if (playerGroup && playerGroup.children[1]) {
            const head = playerGroup.children[1];
            
            // Remove old hat if exists
            const oldHat = head.children.find(c => c.userData.isHat);
            if (oldHat) head.remove(oldHat);

            // Create Santa Hat
            const hatGroup = new THREE.Group();
            
            // Red Cone
            const cone = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.3, 8), 
                new THREE.MeshStandardMaterial({color: 0xff0000}) // RED
            );
            cone.position.y = 0.25; // Sit on top of head
            
            // White Trim
            const trim = new THREE.Mesh(
                new THREE.TorusGeometry(0.12, 0.04, 4, 8),
                new THREE.MeshStandardMaterial({color: 0xffffff}) // WHITE
            );
            trim.position.y = 0.15;

            // Ball on top
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial({color: 0xffffff}));
            ball.position.y = 0.4;
            // ball.position.x = 0.1; // Flop to side (Optional)

            hatGroup.add(cone, trim, ball);
            hatGroup.userData.isHat = true;
            
            head.add(hatGroup);
            addChatMessage("Ho ho ho!", "red");
        }
    }
}
