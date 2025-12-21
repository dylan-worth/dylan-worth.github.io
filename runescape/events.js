import * as THREE from 'three';
import { addChatMessage } from './chat.js';

let activeEvent = null;
let eventInterval = null;

export function triggerSnowballEvent(scene, playerGroup) {
    if (activeEvent) return; 
    
    addChatMessage("A group of ruffians appears to throw snowballs!", "cyan");

    const enemies = [];
    const positions = [
        { x: playerGroup.position.x + 5, z: playerGroup.position.z + 5 },
        { x: playerGroup.position.x - 5, z: playerGroup.position.z + 5 },
        { x: playerGroup.position.x + 5, z: playerGroup.position.z - 5 }
    ];

    positions.forEach(pos => {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: 0xeeeeee}));
        body.position.y = 0.8;
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: 0xffccaa}));
        head.position.y = 1.4;
        group.add(body, head);
        group.position.set(pos.x, 0, pos.z);
        group.userData = { type: 'npc', name: 'Ruffian', hp: 10 }; 
        scene.add(group);
        enemies.push(group);
    });

    activeEvent = { enemies, scene };

    let throwCount = 0;
    eventInterval = setInterval(() => {
        if (throwCount > 10) { endEvent(); return; }
        enemies.forEach(enemy => {
            enemy.lookAt(playerGroup.position);
            throwSnowball(scene, enemy.position, playerGroup.position);
        });
        throwCount++;
    }, 1500);
}

function throwSnowball(scene, startPos, targetPos) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({color: 0xffffff}));
    ball.position.copy(startPos);
    ball.position.y = 1.5;
    scene.add(ball);

    let progress = 0;
    const animateBall = () => {
        progress += 0.05;
        if (progress >= 1) { scene.remove(ball); return; }
        ball.position.lerpVectors(startPos, targetPos, progress);
        ball.position.y = 1.5 + Math.sin(progress * Math.PI) * 2; 
        requestAnimationFrame(animateBall);
    };
    animateBall();
}

function endEvent() {
    if (!activeEvent) return;
    clearInterval(eventInterval);
    addChatMessage("The ruffians run away!", "cyan");
    activeEvent.enemies.forEach(e => activeEvent.scene.remove(e));
    activeEvent = null;
    eventInterval = null;
}
