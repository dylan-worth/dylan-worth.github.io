import { initRenderer, scene, camera, renderer, playerGroup, controls, setDayNight } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, removeItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { openChess } from './chess.js'; 
import { setupChat, addChatMessage } from './chat.js';
import { startCombat, triggerSmite, pacifyNPC } from './combat.js'; 
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js';
import { createSnowman } from './assets_entities.js'; 
import { triggerSnowballEvent } from './events.js'; 
import { triggerSnowWeather } from './weather.js'; 
import { equipItem } from './equipment.js'; 
import { talkToNPC } from './quests.js';    
import * as THREE from 'three';

window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    inventory: [], 
    bank: [],
    selectedSnowPile: null, 
    selectedItem: null,
    gameTime: 12, // Noon
    lanternLights: [] // Stores the PointLights
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    
    setupMovement(camera, scene, playerGroup, onInteract);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Open881.", "yellow");
        
        if(!window.gameState.inventory || window.gameState.inventory.length === 0) {
             addItem('axe_bronze', 'Bronze Axe', 1);
             addItem('sword_iron', 'Iron Sword', 1); 
             addItem('santa_hat', 'Santa Hat', 1); // FREE SANTA HAT
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error("Level Load Error:", e); }

    // GAME LOOP
    setInterval(() => {
        if(Math.random() < 0.01) triggerSnowWeather(scene, playerGroup);
        if(Math.random() < 0.002) triggerSnowballEvent(scene, playerGroup);
        
        // SLOWED DOWN DAY/NIGHT (was 0.05)
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();

    }, 1000);

    animate();
}

function updateEnvironment() {
    const t = window.gameState.gameTime;
    let intensity = 1.0;
    let skyColor = 0x87ceeb; 
    let lanternOn = false;

    // Night Logic (Between 19:00 and 6:00)
    if (t > 19 || t < 6) {
        intensity = 0.2; 
        skyColor = 0x1a1a2a; 
        lanternOn = true;
    } else if (t > 17 || t < 8) {
        intensity = 0.5; 
        skyColor = 0xffa500; 
    }

    setDayNight(intensity, skyColor);
    
    // UPDATE LANTERNS
    if(window.gameState.lanternLights) {
        window.gameState.lanternLights.forEach(light => {
            light.intensity = lanternOn ? 1.0 : 0;
        });
    }
}

function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;
            const name = group.userData.name;

            if (type === 'quest_npc') { talkToNPC(name); break; }
            if (type === 'npc') {
                if (window.gameState.selectedItem === 'snowball') {
                    if (removeItem('snowball', 1)) {
                        addChatMessage("You throw a snowball!", "cyan");
                        pacifyNPC(group); 
                        window.gameState.selectedItem = null; 
                    } else {
                        addChatMessage("No snowballs left!", "red");
                    }
                } else {
                    startCombat(group); 
                }
                break; 
            }
            if (type === 'snow_pile') {
                window.gameState.selectedSnowPile = group;
                const modal = document.getElementById('snow-modal');
                if(modal) modal.style.display = 'flex';
                break;
            }
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
            if (type === 'chess_table') { openChess(); break; } 
        }
    }
}

window.selectItem = (id) => { 
    window.gameState.selectedItem = id; 
    if (id.includes('axe') || id.includes('sword') || id.includes('hat')) {
        equipItem(id);
    }
};

window.handleSnowChoice = (choice) => {
    const pile = window.gameState.selectedSnowPile;
    if (!pile) return;
    if (choice === 'take') {
        if(addItem('snowball', 'Snowball', 1)) addChatMessage("Packed a snowball.", "white");
    } else if (choice === 'build') {
        createSnowman(scene, pile.position.x, pile.position.z);
        pile.visible = false;
        addChatMessage("Built a snowman!", "cyan");
    }
    document.getElementById('snow-modal').style.display = 'none';
    window.gameState.selectedSnowPile = null;
};

function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    const axe = getBestAxe();
    if(!axe) { addChatMessage("No axe.", "red"); return; }
    equipItem(axe.id);
    addChatMessage("Chopping...", "white");
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        if(addItem('logs', 'Logs', 1)) {
            addXp('woodcutting', treeGroup.userData.xp);
            updateStatsUI();
            clearInterval(choppingInterval);
            treeGroup.userData.respawning = true;
            if(treeGroup.children[1]) treeGroup.children[1].visible = false;
            setTimeout(() => { treeGroup.children[1].visible = true; treeGroup.userData.respawning = false; }, 3000);
        } else {
            clearInterval(choppingInterval);
            addChatMessage("Full.", "red");
        }
    }, 600);
}

export function triggerTeleport(loc) {
    window.gameState.colliders = [];
    window.gameState.buildings = [];
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
    addChatMessage(`Teleported to ${loc}.`, "cyan");
}

function smiteCommand() { triggerSmite(scene); }
function commandTriggerEvent() { triggerSnowballEvent(scene, playerGroup); }

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    if (controls && playerGroup) {
        controls.target.copy(playerGroup.position);
        controls.target.y += 1.0; 
        controls.update();
    }
    updateMinimap(scene, playerGroup);
    renderer.render(scene, camera);
}

window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell,
    openBank: openBank,
    switchTab: switchTab,
    smite: smiteCommand,
    openChess: openChess,
    triggerEvent: commandTriggerEvent
};
