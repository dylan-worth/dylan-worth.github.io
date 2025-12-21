import { addChatMessage } from './chat.js';
import { addXp } from './stats.js';     // Handles Level-ups
import { updateStatsUI } from './ui.js'; // Handles HTML updates

let combatInterval = null;
let currentTarget = null;

// --- MATH HELPERS ---

// Max Hit Formula: 1 + Strength/10
function getMaxHit(strength) {
    return Math.floor(1 + strength / 10);
}

// Accuracy Roll: Random(0 to Attack + 5)
function getAccuracy(attack) {
    return Math.random() * (attack + 5);
}

// Defence Roll: Random(0 to Defence + 5)
function getDefence(defence) {
    return Math.random() * (defence + 5);
}

// --- MAIN LOGIC ---

export function startCombat(targetGroup) {
    // Stop any existing combat first
    if (combatInterval) clearInterval(combatInterval);
    
    currentTarget = targetGroup;
    const targetName = targetGroup.userData.name || "Enemy";
    const skills = window.gameState.skills;

    addChatMessage(`You attack the ${targetName}!`, "orange");

    // Combat Loop (1.2 seconds = approx 2 game ticks)
    combatInterval = setInterval(() => {
        // Validation: Does target still exist and is visible?
        if (!currentTarget || !currentTarget.parent || !currentTarget.visible) {
            stopCombat();
            return;
        }

        // --- 1. PLAYER ATTACK PHASE ---
        
        // Roll Accuracy vs Defence
        const playerAcc = getAccuracy(skills.attack.level);
        const npcDef = getDefence(targetGroup.userData.combatLevel || 1); 
        
        let damage = 0;
        
        if (playerAcc > npcDef) {
            // Hit success! Roll for damage
            const maxHit = getMaxHit(skills.strength.level);
            damage = Math.floor(Math.random() * (maxHit + 1));
        }

        // Apply Damage
        targetGroup.userData.hp -= damage;
        
        if (damage > 0) {
            addChatMessage(`You hit ${damage}.`, "red");
            
            // XP Drops (1.33 XP per damage point)
            // Currently splits XP evenly across melee stats
            addXp('hitpoints', damage * 1.33);
            addXp('attack', damage * 1.33);
            addXp('strength', damage * 1.33);
            addXp('defence', damage * 1.33);
        } else {
            addChatMessage(`You missed.`, "blue");
        }

        // Check for NPC Death
        if (targetGroup.userData.hp <= 0) {
            handleNPCDeath(targetGroup);
            return; // Stop the loop immediately
        }

        // --- 2. NPC ATTACK PHASE ---
        
        // Simple NPC AI: Hits between 0 and 2
        const npcHit = Math.floor(Math.random() * 3); // 0, 1, or 2
        
        if (npcHit > 0) {
            // Reduce Player Current HP
            if (skills.hitpoints.level > 0) {
                skills.hitpoints.level -= npcHit;
                addChatMessage(`The ${targetName} hits you for ${npcHit}!`, "red");
                
                // Check for Player Death
                if (skills.hitpoints.level <= 0) {
                    handlePlayerDeath();
                    return;
                }
            }
        }

        // Update the UI with new HP/XP values
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
    addChatMessage(`You killed the ${name}!`, "lime");
    stopCombat();
    
    // Despawn (Hide)
    targetGroup.visible = false;
    
    // Respawn Timer (5 seconds)
    setTimeout(() => {
        targetGroup.userData.hp = targetGroup.userData.maxHp;
        targetGroup.visible = true;
    }, 5000);
    
    updateStatsUI();
}

function handlePlayerDeath() {
    addChatMessage("Oh dear, you are dead!", "red");
    stopCombat();
    
    // Reset HP to base level (or max based on XP)
    // For simplicity, we just reset to 10 here.
    window.gameState.skills.hitpoints.level = 10; 
    updateStatsUI();
    
    // Send to Lumbridge
    if (window.game && window.game.teleport) {
        window.game.teleport('lumbridge');
    }
}
