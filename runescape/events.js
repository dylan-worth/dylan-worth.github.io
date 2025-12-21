import * as THREE from 'three';
import { createNPC } from './assets_entities.js';
import { addChatMessage } from './chat.js';

let activeEvent = null;
let eventInterval = null;

export function triggerSnowballEvent(scene, playerGroup) {
    if (activeEvent) return; // Don't run two at once
    
    addChatMessage("A group of ruffians appears to throw snowballs!", "cyan");

    const enemies = [];
    const positions = [
        { x: playerGroup.position.x + 5, z: playerGroup.position.z + 5 },
        { x: playerGroup.position.x - 5, z: playerGroup.position.z + 5 },
        { x: playerGroup.position.x + 5, z: playerGroup.position.z - 5 }
    ];

    // 1. Spawn 3 "Men" (We use 'man' type but could color them differently if assets allowed)
    positions.forEach(pos => {
        // Create NPC manually to track them
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: 0xeeeeee})); // White coat
        body.position.y = 0.8;
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: 0xffccaa}));
        head.position.y = 1.4;
        group.add(body, head);
        group.position.set(pos.x, 0, pos.z);
        
        scene.add(group);
        enemies.push(group);
    });

    activeEvent = { enemies, scene };

    // 2. Throw Loop (Every 1.5 seconds)
    let throwCount = 0;
    eventInterval = setInterval(() => {
        if (throwCount > 10) { endEvent(); return; } // End after ~15 seconds

        enemies.forEach(enemy => {
            enemy.lookAt(playerGroup.position);
            throwSnowball(scene, enemy.position, playerGroup.position);
        });
        
        throwCount++;
    }, 1500);
}

function throwSnowball(scene, startPos, targetPos) {
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8), 
        new THREE.MeshBasicMaterial({color: 0xffffff})
    );
    ball.position.copy(startPos);
    ball.position.y = 1.5; // Throw from head height
    scene.add(ball);

    // Simple Animation Loop for this ball
    let progress = 0;
    const animateBall = () => {
        progress += 0.05;
        if (progress >= 1) {
            scene.remove(ball);
            return;
        }
        
        // Linear interpolation (Lerp)
        ball.position.lerpVectors(startPos, targetPos, progress);
        // Add a little arc
        ball.position.y = 1.5 + Math.sin(progress * Math.PI) * 2; 

        requestAnimationFrame(animateBall);
    };
    animateBall();
}

function endEvent() {
    if (!activeEvent) return;
    
    clearInterval(eventInterval);
    addChatMessage("The ruffians run away!", "cyan");
    
    // Despawn enemies
    activeEvent.enemies.forEach(e => activeEvent.scene.remove(e));
    
    activeEvent = null;
    eventInterval = null;
}
