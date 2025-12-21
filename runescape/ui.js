// ui.js
import { getCombatLevel } from './stats.js';

export function updateStatsUI() {
    const s = window.gameState.skills;
    if (!s) return;

    // Helper to safe update
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    set('stat-att', s.attack.level);
    set('stat-str', s.strength.level);
    set('stat-def', s.defence.level);
    set('stat-rng', s.ranged.level);
    set('stat-mag', s.magic.level);
    set('stat-pra', s.prayer.level);
    set('stat-hp', s.hitpoints.level); // Current HP
    set('wc-level', s.woodcutting.level);
    set('wc-xp', Math.floor(s.woodcutting.xp));

    // Optional: Update Combat Level Display if we add one
    // const cmb = getCombatLevel(s);
    // set('combat-level', cmb);
}

export function closeWindows() {
    const bank = document.getElementById('bank-window');
    const shop = document.getElementById('shop-window');
    if (bank) bank.style.display = 'none';
    if (shop) shop.style.display = 'none';
    
    // Reset game state UI mode
    if (window.gameState) window.gameState.uiMode = 'normal';
}

// We can also move the tab switching logic here if we want to remove it from HTML
export function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}
