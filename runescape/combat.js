import { addChatMessage } from './chat.js';
import { addXp } from './stats.js';
import { updateStatsUI } from './ui.js';
import { rollLoot } from './loot.js'; 
import { playSwingAnimation } from './render.js'; 
import * as THREE from 'three'; 

let combatInterval = null;
let currentTarget = null;

// --- SMITE (Debug Command) ---
export function triggerSmite(scene) {
    if (!currentTarget || !currentTarget.visible) {
        addChatMessage("You are not fighting anyone!", "red");
        return;
    }
    const targetPos = currentTarget.position;
    
    // Visual Lightning Bolt
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bolt = new THREE.Mesh(geo, mat);
    bolt.position.set(targetPos.x, 15, targetPos.z);
    scene.add(bolt);
    
    setTimeout(() => { scene.remove(bolt); }, 200);

    addChatMessage("Smited!", "gold");
    currentTarget.userData.hp = 0;
    // The next combat tick handles the death logic
}

// --- PACIFY (Snowball Effect) ---
export function pacifyNPC(targetGroup) {
    if (!targetGroup) return;
    
    // Visual Effect: Freeze (Turn Cyan)
    targetGroup.children.forEach(c => {
        if(c.material) {
            c.material.color.setHex(0x00ffff); 
        }
    });

    addChatMessage(`${targetGroup.userData.name} is stunned by the snow!`, "cyan");
    
    if (currentTarget === targetGroup) {
        stopCombat();
    }
    
    // Reset NPC color after 5 seconds
    setTimeout(() => {
        if (!targetGroup.visible) return; 
        
        targetGroup.children.forEach(c => {
            if (targetGroup.userData.npcType === 'man') {
                if (c.geometry.type === 'BoxGeometry') c.material.color.setHex(0x445588);
                else c.material.color.setHex(0xffccaa);
            } else if (targetGroup.userData.npcType === 'goblin') {
                 if (c.geometry.type === 'BoxGeometry') c.material.color.setHex(0x558855);
                 else c.material.color.setHex(0x00ff00);
            }
        });
    }, 5000);
}

// --- MAIN COMBAT LOOP ---
export function startCombat(targetGroup) {
    if (combatInterval) clearInterval(combatInterval);
    currentTarget = targetGroup;
    const skills = window.gameState.skills;

    addChatMessage(`Attacking ${targetGroup.userData.name}...`, "orange");

    combatInterval = setInterval(() => {
        // 1. Validate Target
        if (!currentTarget || !currentTarget.parent || !currentTarget.visible) {
            stopCombat(); return;
        }

        // 2. Trigger Visual Swing Animation
        playSwingAnimation();

        // 3. Calculate Player Hit
        const hitChance = (Math.random() * (skills.attack.level + 5));
        const blockChance = (Math.random() * 5); 
        const hit = hitChance > blockChance;
        
        let dmg = 0;
        if (hit) {
            dmg = Math.floor(Math.random() * (2 + skills.strength.level / 5));
            if (dmg === 0) dmg = 1; 
        }

        // 4. Apply Damage to NPC
        if (dmg > 0) {
            currentTarget.userData.hp -= dmg;
            addChatMessage(`You hit ${dmg}.`, "red");
            addXp('hitpoints', dmg * 1.3);
            addXp('strength', dmg * 2.0); 
            addXp('attack', dmg * 2.0);
        } else {
            addChatMessage("You missed.", "grey");
        }

        // 5. Check NPC Death
        if (currentTarget.userData.hp <= 0) {
            handleNPCDeath(currentTarget);
            return;
        }

        // 6. NPC Hits Back (Delayed slightly for realism)
        setTimeout(() => {
            if (!currentTarget || !currentTarget.visible) return;
            if (Math.random() > 0.6) {
                const npcDmg = Math.floor(Math.random() * 2);
                if (npcDmg > 0) {
                    skills.hitpoints.level -= npcDmg;
                    addChatMessage(`The ${currentTarget.userData.name} hits you for ${npcDmg}!`, "red");
                    if (skills.hitpoints.level <= 0) handlePlayerDeath();
                }
            }
            updateStatsUI();
        }, 400);

    }, 1200); // 1.2s intervals to match swing timing
}

export function stopCombat() {
    if (combatInterval) clearInterval(combatInterval);
    combatInterval = null;
    currentTarget = null;
}

function handleNPCDeath(target) {
    addChatMessage(`You killed the ${target.userData.name}!`, "lime");
    stopCombat();
    
    // Loot
    rollLoot(target.userData.npcType);

    // Respawn Logic
    target.visible = false;
    setTimeout(() => {
        target.userData.hp = target.userData.maxHp;
        target.visible = true;
    }, 5000); 
    
    updateStatsUI();
}

function handlePlayerDeath() {
    addChatMessage("Oh dear, you are dead!", "red");
    stopCombat();
    
    // Reset HP to level 10
    window.gameState.skills.hitpoints.level = 10; 
    updateStatsUI();
    
    // Teleport back to start
    if (window.game && window.game.teleport) {
        window.game.teleport('lumbridge');
    }
}
