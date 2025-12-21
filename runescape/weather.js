import * as THREE from 'three';
import { addChatMessage } from './chat.js';

let snowSystem = null;
let isSnowing = false;

export function triggerSnowWeather(scene, player) {
    if (isSnowing) return;
    isSnowing = true;
    addChatMessage("A cold wind blows... It starts to snow!", "cyan");

    // Create Particles
    const count = 1000;
    const geo = new THREE.BufferGeometry();
    const positions = [];
    
    for(let i=0; i<count; i++) {
        positions.push(
            (Math.random() - 0.5) * 60, 
            Math.random() * 30,         
            (Math.random() - 0.5) * 60  
        );
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true });
    snowSystem = new THREE.Points(geo, mat);
    
    scene.add(snowSystem);

    const animateSnow = () => {
        if (!isSnowing) {
            if(snowSystem) scene.remove(snowSystem);
            return;
        }
        if(snowSystem) {
            const positions = snowSystem.geometry.attributes.position.array;
            for(let i=1; i<positions.length; i+=3) {
                positions[i] -= 0.1; 
                if (positions[i] < 0) positions[i] = 30; 
            }
            snowSystem.position.x = player.position.x;
            snowSystem.position.z = player.position.z;
            snowSystem.geometry.attributes.position.needsUpdate = true;
        }
        requestAnimationFrame(animateSnow);
    };
    animateSnow();

    setTimeout(() => {
        isSnowing = false;
        addChatMessage("The snow stops falling.", "cyan");
    }, 30000);
}
