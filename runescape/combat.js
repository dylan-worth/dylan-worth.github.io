import { addChatMessage } from './chat.js';
import { addXp } from './stats.js';
import { updateStatsUI } from './ui.js';
import { rollLoot } from './loot.js';
import * as THREE from 'three'; // Needed for Lightning visual

let combatInterval = null;
let currentTarget = null;

function getMaxHit(strength) { return Math.floor(1 + strength / 10); }
function getAccuracy(attack) { return Math.random() * (attack + 5); }
function getDefence(defence) { return Math.random() * (defence + 5); }

// --- SMITE COMMAND LOGIC ---
export function triggerSmite(scene) {
    if (!currentTarget || !currentTarget.visible) {
        addChatMessage("You are not fighting anyone to smite!", "red");
        return;
    }

    const targetPos = currentTarget.position;
    
    // 1. VISUAL: Giant Yellow Beam
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bolt = new THREE.Mesh(geo, mat);
    bolt.position.set(targetPos.x, 15, targetPos.z);
    scene.add(bolt);

    // Remove bolt after 200ms
    setTimeout(() => { scene.remove(bolt); }, 200);

    // 2. LOGIC: Instant Kill
    addChatMessage("The gods strike your foe with lightning!", "gold");
    currentTarget.userData.hp = 0;
    
    // We let the combat loop handle the actual death cleanup on the next tick
    // to ensure XP/Loot drops happen correctly.
}

export function startCombat(targetGroup) {
    if (combatInterval) clearInterval(combatInterval);
    
    currentTarget = targetGroup;
    const targetName = targetGroup.userData.name || "Enemy";
    const skills = window.gameState.skills;

    addChatMessage(`You attack the ${targetName}!`, "orange");

    combatInterval = setInterval(() => {
        if (!currentTarget || !currentTarget.parent || !currentTarget.visible) {
            stopCombat();
            return;
        }

        // PLAYER ATTACK
        const playerAcc = getAccuracy(skills.attack.level);
        const npcDef = getDefence(targetGroup.userData.combatLevel || 1); 
        
        let damage = 0;
        if (playerAcc > npcDef) {
            const maxHit = getMaxHit(skills.strength.level);
            damage = Math.floor(Math.random() * (maxHit + 1));
        }

        targetGroup.userData.hp -= damage;
        
        if (damage > 0) {
            addChatMessage(`You hit ${damage}.`, "red");
            addXp('hitpoints', damage * 1.33);
            addXp('attack', damage * 1.33);
            addXp('strength', damage * 1.33);
            addXp('defence', damage * 1.33);
        } else {
            addChatMessage(`You missed.`, "blue");
        }

        // DEATH CHECK
        if (targetGroup.userData.hp <= 0) {
            handleNPCDeath(targetGroup);
            return; 
        }

        // NPC ATTACK
        const npcHit = Math.floor(Math.random() * 2); 
        if (npcHit > 0 && skills.hitpoints.level > 0) {
            skills.hitpoints.level -= npcHit;
            addChatMessage(`The ${targetName} hits you for ${npcHit}!`, "red");
            if (skills.hitpoints.level <= 0) {
                handlePlayerDeath();
                return;
            }
        }
        updateStatsUI();

    }, 1200); 
}

function stopCombat() {
    if (combatInterval) clearInterval(combatInterval);
    combatInterval = null;
    currentTarget = null;
}

function handleNPCDeath(targetGroup) {
    const name = targetGroup.userData.name;
    const type = targetGroup.userData.npcType; 
    
    addChatMessage(`You killed the ${name}!`, "lime");
    stopCombat();
    
    rollLoot(type); 
    
    targetGroup.visible = false;
    setTimeout(() => {
        targetGroup.userData.hp = targetGroup.userData.maxHp;
        targetGroup.visible = true;
    }, 5000);
    
    updateStatsUI();
}

function handlePlayerDeath() {
    addChatMessage("Oh dear, you are dead!", "red");
    stopCombat();
    window.gameState.skills.hitpoints.level = 10; 
    updateStatsUI();
    if (window.game && window.game.teleport) window.game.teleport('lumbridge');
}
