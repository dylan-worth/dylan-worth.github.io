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
    // 1. Initialize the 3D Engine first
    initRenderer();
    window.gameState.player = playerGroup; 

    // 2. Load the Level (This waits for the 3 JSON files now)
    try { 
        await loadLevel(scene, 'lumbridge'); 
        
        // 3. ONLY ONCE THE LEVEL IS LOADED, SETUP EVENTS
        // This prevents "Event System Not Ready" by ensuring the world exists first
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

    // 4. Start Loops
    setInterval(() => {
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();
    }, 1000);

    animate();
}

// ... updateEnvironment, attemptChop, and animate functions remain the same ...

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
    
    if (controls && playerGroup) {
        controls.target.lerp(playerGroup.position, 0.1);
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
