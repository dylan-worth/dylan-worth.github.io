import { addChatMessage } from './chat.js';
import { addXp } from './stats.js';
import { updateStatsUI } from './ui.js';
import { rollLoot } from './loot.js'; 
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
    
    // Visual Bolt
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bolt = new THREE.Mesh(geo, mat);
    bolt.position.set(targetPos.x, 15, targetPos.z);
    scene.add(bolt);
    
    setTimeout(() => { scene.remove(bolt); }, 200);

    addChatMessage("Smited!", "gold");
    // Instant Kill
    currentTarget.userData.hp = 0;
    // Let the next combat tick handle the death logic
}

// --- PACIFY (Snowball Effect) ---
export function pacifyNPC(targetGroup) {
    if (!targetGroup) return;
    
    // 1. Visual Effect (Turn Blue)
    targetGroup.children.forEach(c => {
        if(c.material) {
            // Store original color if we wanted to be precise, 
            // but for now we just reset to standard colors later.
            c.material.color.setHex(0x00ffff); 
        }
    });

    addChatMessage(`${targetGroup.userData.name} is stunned by the snow!`, "cyan");
    
    // 2. Stop Combat if we are fighting them
    if (currentTarget === targetGroup) {
        stopCombat();
    }
    
    // 3. Reset after 5 seconds
    setTimeout(() => {
        if (!targetGroup.visible) return; // If they died/respawned, ignore
        
        targetGroup.children.forEach(c => {
            // Restore colors based on NPC type logic (Simplified)
            // Ideally we'd store the original color in userData, but this works for "Man"
            if (targetGroup.userData.npcType === 'man') {
                if (c.geometry.type === 'BoxGeometry') c.material.color.setHex(0x445588); // Shirt
                else c.material.color.setHex(0xffccaa); // Head
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

        // 2. Calculate Player Hit
        // Simple formula: Random(Attack Level) vs Random(Defense=5)
        const hitChance = (Math.random() * (skills.attack.level + 5));
        const blockChance = (Math.random() * 5); 
        const hit = hitChance > blockChance;
        
        let dmg = 0;
        if (hit) {
            dmg = Math.floor(Math.random() * (1 + skills.strength.level / 5));
            if (dmg === 0) dmg = 1; // Pity damage
        }

        // 3. Apply Damage
        if (dmg > 0) {
            currentTarget.userData.hp -= dmg;
            addChatMessage(`You hit ${dmg}.`, "red");
            addXp('hitpoints', dmg * 1.3);
            addXp('strength', dmg * 2.0); 
            addXp('attack', dmg * 2.0);
        } else {
            addChatMessage("You missed.", "grey");
        }

        // 4. Check NPC Death
        if (currentTarget.userData.hp <= 0) {
            handleNPCDeath(currentTarget);
            return;
        }

        // 5. NPC Hits Back
        if(Math.random() > 0.6) {
            const npcDmg = Math.floor(Math.random() * 2); // 0 or 1
            if (npcDmg > 0) {
                skills.hitpoints.level -= npcDmg;
                addChatMessage(`The ${currentTarget.userData.name} hits you for ${npcDmg}!`, "red");
                if(skills.hitpoints.level <= 0) handlePlayerDeath();
            }
        }
        updateStatsUI();

    }, 1000); // 1 tick per second
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
    try {
        rollLoot(target.userData.npcType);
    } catch(e) {
        console.error("Loot Error:", e);
    }

    // Respawn Logic
    target.visible = false;
    setTimeout(() => {
        target.userData.hp = target.userData.maxHp;
        target.visible = true;
        // Reset color in case they died while frozen
        target.children.forEach(c => {
             if (c.geometry.type === 'BoxGeometry') c.material.color.setHex(0x445588); // Default reset
        });
    }, 5000); // 5 second respawn
    
    updateStatsUI();
}

function handlePlayerDeath() {
    addChatMessage("Oh dear, you are dead!", "red");
    stopCombat();
    
    // Reset HP
    window.gameState.skills.hitpoints.level = window.gameState.skills.hitpoints.xp > 1154 ? 10 : 10; 
    updateStatsUI();
    
    // Teleport Home
    if(window.game && window.game.teleport) {
        window.game.teleport('lumbridge');
    }
}
