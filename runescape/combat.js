import { addChatMessage } from './chat.js';
import { addXp } from './stats.js';
import { updateStatsUI } from './ui.js';
import { rollLoot } from './loot.js'; 
import { playSwingAnimation, spawnHitSplat } from './render.js'; 
import * as THREE from 'three'; 

let combatInterval = null;
let currentTarget = null;

/**
 * SMITE: High-damage debug command with visual lightning effect.
 */
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

    // Instant kill logic
    currentTarget.userData.hp = 0;
    spawnHitSplat(currentTarget, 99, false); // Massive red splat
}

/**
 * PACIFY: Stuns an NPC using the snowball event mechanics.
 */
export function pacifyNPC(targetGroup) {
    if (!targetGroup) return;
    
    // Visual Freeze Effect
    targetGroup.children.forEach(c => {
        if(c.material) c.material.color.setHex(0x00ffff); 
    });

    addChatMessage(`${targetGroup.userData.name} is stunned!`, "cyan");
    
    if (currentTarget === targetGroup) stopCombat();
    
    // Thaw after 5 seconds
    setTimeout(() => {
        if (!targetGroup.visible) return; 
        targetGroup.children.forEach(c => {
            // Restore original colors based on NPC type
            if (targetGroup.userData.npcType === 'man') {
                c.material.color.setHex(c.geometry.type === 'BoxGeometry' ? 0x445588 : 0xffccaa);
            } else if (targetGroup.userData.npcType === 'goblin') {
                c.material.color.setHex(c.geometry.type === 'BoxGeometry' ? 0x558855 : 0x00ff00);
            }
        });
    }, 5000);
}

/**
 * MAIN COMBAT LOOP: Triggers swings, calculates hits, and spawns hit-splats.
 */
export function startCombat(targetGroup) {
    if (combatInterval) clearInterval(combatInterval);
    currentTarget = targetGroup;
    const skills = window.gameState.skills;

    // The character will stop at 1.5 units away due to movement.js updates.
    combatInterval = setInterval(() => {
        if (!currentTarget || !currentTarget.parent || !currentTarget.visible) {
            stopCombat(); 
            return;
        }

        // 1. Visual Swing
        playSwingAnimation();

        // 2. Damage Calculation
        const hitChance = (Math.random() * (skills.attack.level + 5));
        const blockChance = (Math.random() * 5); 
        const hit = hitChance > blockChance;
        
        let dmg = 0;
        if (hit) {
            dmg = Math.floor(Math.random() * (2 + skills.strength.level / 5));
            if (dmg === 0 && Math.random() > 0.5) dmg = 1; // Minimum hit logic
        }

        // 3. Process Result & Spawn 3D Hit Splats
        if (dmg > 0) {
            currentTarget.userData.hp -= dmg;
            spawnHitSplat(currentTarget, dmg, false); // RED HIT
            addXp('hitpoints', dmg * 1.3);
            addXp('strength', dmg * 2.0); 
            addXp('attack', dmg * 2.0);
        } else {
            spawnHitSplat(currentTarget, 0, true); // BLUE MISS
        }

        if (currentTarget.userData.hp <= 0) {
            handleNPCDeath(currentTarget);
            return;
        }

        // 4. NPC Retaliation
        setTimeout(() => {
            if (!currentTarget || !currentTarget.visible) return;
            if (Math.random() > 0.7) { // 30% chance to hit back
                const npcDmg = Math.floor(Math.random() * 2);
                if (npcDmg > 0) {
                    skills.hitpoints.level -= npcDmg;
                    spawnHitSplat(window.gameState.player, npcDmg, false); // Splat on player
                    if (skills.hitpoints.level <= 0) handlePlayerDeath();
                }
            }
            updateStatsUI();
        }, 500);

    }, 1200); // Matched to swing animation speed
}

export function stopCombat() {
    if (combatInterval) clearInterval(combatInterval);
    combatInterval = null;
    currentTarget = null;
}

function handleNPCDeath(target) {
    stopCombat();
    rollLoot(target.userData.npcType);
    target.visible = false;
    setTimeout(() => {
        target.userData.hp = target.userData.maxHp;
        target.visible = true;
    }, 5000); // 5 second respawn timer
    updateStatsUI();
}

function handlePlayerDeath() {
    stopCombat();
    addChatMessage("Oh dear, you are dead!", "red");
    window.gameState.skills.hitpoints.level = 10; 
    updateStatsUI();
    
    // Respawns at Lumbridge start point
    if (window.game && window.game.teleport) {
        window.game.teleport('lumbridge');
    }
}
