import * as THREE from 'three';
import { playerHand, playerLeftHand, playerGroup } from './render.js';
import { addChatMessage } from './chat.js';

export function equipItem(itemId) {
    if (!playerHand || !playerLeftHand) return;

    // --- RIGHT HAND (Weapons) ---
    if (itemId.includes('axe') || itemId.includes('sword') || itemId.includes('dagger')) {
        while(playerHand.children.length > 0){ playerHand.remove(playerHand.children[0]); }
        
        let mesh = null;
        const matColor = itemId.includes('bronze') ? 0xcd7f32 : 0xcccccc;

        if (itemId.includes('sword')) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), new THREE.MeshStandardMaterial({color: matColor}));
            const guard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), new THREE.MeshStandardMaterial({color: 0x555555}));
            guard.position.y = -0.3;
            mesh = new THREE.Group(); mesh.add(blade, guard); mesh.rotation.x = Math.PI / 2;
        } 
        else if (itemId.includes('dagger')) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.02), new THREE.MeshStandardMaterial({color: matColor}));
            const guard = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.04), new THREE.MeshStandardMaterial({color: 0x555555}));
            guard.position.y = -0.15;
            mesh = new THREE.Group(); mesh.add(blade, guard); mesh.rotation.x = Math.PI / 1.5;
        }
        else if (itemId.includes('axe')) {
            const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), new THREE.MeshStandardMaterial({color: 0x5c4033}));
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), new THREE.MeshStandardMaterial({color: 0x888888}));
            head.position.y = 0.3;
            mesh = new THREE.Group(); mesh.add(handle, head); mesh.rotation.x = Math.PI / 2;
        }

        if (mesh) {
            playerHand.add(mesh);
            addChatMessage(`Wielding: ${itemId}`, "lime");
        }
    }

    // --- LEFT HAND (Shields) ---
    else if (itemId.includes('shield')) {
        while(playerLeftHand.children.length > 0){ playerLeftHand.remove(playerLeftHand.children[0]); }
        
        const matColor = itemId.includes('bronze') ? 0xcd7f32 : 0x555555;
        const shield = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.7, 0.1),
            new THREE.MeshStandardMaterial({color: matColor})
        );
        shield.rotation.y = -0.2;
        playerLeftHand.add(shield);
        addChatMessage(`Equipped: ${itemId}`, "lime");
    }

    // --- HATS ---
    else if (itemId === 'santa_hat') {
        if (playerGroup && playerGroup.children[1]) {
            const head = playerGroup.children[1];
            const oldHat = head.children.find(c => c.userData.isHat);
            if (oldHat) head.remove(oldHat);

            const hatGroup = new THREE.Group();
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 8), new THREE.MeshStandardMaterial({color: 0xff0000}));
            cone.position.y = 0.25; 
            const trim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 4, 8), new THREE.MeshStandardMaterial({color: 0xffffff}));
            trim.position.y = 0.15;
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial({color: 0xffffff}));
            ball.position.y = 0.4;
            hatGroup.add(cone, trim, ball);
            hatGroup.userData.isHat = true;
            head.add(hatGroup);
        }
    }
}
