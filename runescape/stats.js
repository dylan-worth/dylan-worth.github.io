// stats.js

// 1. Define Starting Skills
export const INITIAL_SKILLS = {
    woodcutting: { level: 1, xp: 0 },
    attack: { level: 1, xp: 0 },
    strength: { level: 1, xp: 0 },
    defence: { level: 1, xp: 0 },
    ranged: { level: 1, xp: 0 },
    magic: { level: 1, xp: 0 },
    prayer: { level: 1, xp: 0 },
    hitpoints: { level: 10, xp: 1000 } // Starts at 10 (approx 1000 xp)
};

// 2. Math Helpers
export function xpToLevel(xp) {
    // Formula: Level = 1 + sqrt(xp / 10)
    return Math.floor(1 + Math.sqrt(xp / 10));
}

export function getCombatLevel(skills) {
    const base = 0.25 * (skills.defence.level + skills.hitpoints.level + (skills.prayer.level / 2));
    const melee = 0.325 * (skills.attack.level + skills.strength.level);
    const range = 0.325 * (Math.floor(skills.ranged.level * 1.5));
    const mage = 0.325 * (Math.floor(skills.magic.level * 1.5));
    
    const maxStyle = Math.max(melee, range, mage);
    return Math.floor(base + maxStyle);
}

// 3. Action Helper
export function addXp(skillName, amount) {
    const skill = window.gameState.skills[skillName];
    if (!skill) return;

    skill.xp += amount;
    const oldLevel = skill.level;
    skill.level = xpToLevel(skill.xp);

    // Return true if leveled up (for fireworks later)
    return skill.level > oldLevel;
}
