import { 
    initRenderer, 
    scene, 
    camera, 
    renderer, 
    playerGroup, 
    controls, 
    setDayNight, 
    updateAnimations 
} from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { updateHans } from './lumbridge.js'; 
import { addItem } from './inventory.js'; 
import { setupChat, addChatMessage } from './chat.js';
import { startCombat } from './combat.js'; 
import { INITIAL_SKILLS } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js';
import { equipItem } from './equipment.js'; 
import * as THREE from 'three';

window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    inventory: [], 
    selectedItem: null,
    gameTime: 12,
    lanternLights: []
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export async function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 

    // --- CAMERA START POSITION ---
    // We set the camera closer: 5 units back, 4 units up
    camera.position.set(0, 4, 5); 

    try { 
        await loadLevel(scene, 'lumbridge'); 
        
        setupMovement(camera, scene, playerGroup, onInteract);
        setupChat();
        
        addChatMessage("Welcome to Lumbridge.", "yellow");
        
        if (window.gameState.inventory.length === 0) {
             addItem('sword_bronze', 'Bronze Sword', 1);
             addItem('shield_bronze', 'Bronze Shield', 1);
             addItem('axe_bronze', 'Bronze Axe', 1);
             equipItem('sword_bronze');
             equipItem('shield_bronze');
        }
        updateStatsUI(); 
    } 
    catch(e) { 
        console.error("Initialization failed:", e); 
    }

    setInterval(() => {
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();
    }, 1000);

    animate();
}

// ... updateEnvironment and attemptChop stay the same ...

function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;
            if (type === 'npc') {
                if (group.userData.onInteract) {
                    const response = group.userData.onInteract();
                    if (response) addChatMessage(response, "yellow");
                    return; 
                }
                startCombat(group); 
                break; 
            }
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { addChatMessage("Banker: Welcome to the bank.", "green"); break; }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    updateAnimations();
    updateHans(); 
    
    // --- CAMERA FOLLOW LOGIC ---
    if (controls && playerGroup) {
        // We track the player's position closely
        const targetPos = playerGroup.position.clone();
        targetPos.y += 1.2; // Aim at character chest/head height
        
        controls.target.lerp(targetPos, 0.2); // Faster lerp for tighter following
        controls.update();
    }

    updateMinimap(scene, playerGroup);
    renderer.render(scene, camera);
}

window.game = {
    teleport: (loc) => loadLevel(scene, loc),
    closeWindows,
    switchTab,
    selectItem: (id) => { 
        window.gameState.selectedItem = id; 
        equipItem(id);
    }
};

window.onload = initGame;
