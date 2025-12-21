// 1. DEFINE STARTING SKILLS
export const INITIAL_SKILLS = {
    woodcutting: { level: 1, xp: 0 },
    attack:     { level: 1, xp: 0 },
    strength:   { level: 1, xp: 0 },
    defence:    { level: 1, xp: 0 },
    ranged:     { level: 1, xp: 0 },
    magic:      { level: 1, xp: 0 },
    prayer:     { level: 1, xp: 0 },
    hitpoints:  { level: 10, xp: 1154 } // Starts at level 10 (approx 1154 xp)
};

// 2. XP FORMULA
// Standard OSRS formula: Level = 1 + sqrt(XP / 10) roughly
// Real formula is complex, but this simple one works for now.
export function xpToLevel(xp) {
    return Math.floor(1 + Math.sqrt(xp / 10));
}

// 3. LEVEL UP FUNCTION
// Returns true if the player leveled up (so we can play a sound/message)
export function addXp(skillName, amount) {
    const skill = window.gameState.skills[skillName];
    
    // Safety check
    if (!skill) {
        console.error(`Skill ${skillName} does not exist!`);
        return false;
    }

    const oldLevel = skill.level;
    skill.xp += amount;
    skill.level = xpToLevel(skill.xp);

    // Check for level up
    if (skill.level > oldLevel) {
        // Special case for Hitpoints: Leveling up heals you
        if (skillName === 'hitpoints') {
            skill.level = xpToLevel(skill.xp); // Ensure current HP matches new max
        }
        return true;
    }
    
    return false;
}

// 4. COMBAT LEVEL CALCULATOR
export function getCombatLevel(skills) {
    // Base = 0.25 * (Def + HP + Prayer/2)
    const base = 0.25 * (skills.defence.level + skills.hitpoints.level + Math.floor(skills.prayer.level / 2));
    
    // Melee = 0.325 * (Att + Str)
    const melee = 0.325 * (skills.attack.level + skills.strength.level);
    
    // Range = 0.325 * (Range * 1.5)
    const range = 0.325 * (Math.floor(skills.ranged.level * 1.5));
    
    // Mage = 0.325 * (Mage * 1.5)
    const mage = 0.325 * (Math.floor(skills.magic.level * 1.5));
    
    const maxStyle = Math.max(melee, range, mage);
    
    return Math.floor(base + maxStyle);
}
