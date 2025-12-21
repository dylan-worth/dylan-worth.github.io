// ui.js - Handles all HTML DOM updates

// 1. UPDATE STATS PANEL
export function updateStatsUI() {
    const s = window.gameState.skills;
    if (!s) return;

    // Helper to safely update text if element exists
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    // Combat Stats
    set('stat-att', s.attack.level);
    set('stat-str', s.strength.level);
    set('stat-def', s.defence.level);
    set('stat-rng', s.ranged.level);
    set('stat-mag', s.magic.level);
    set('stat-pra', s.prayer.level);
    set('stat-hp', s.hitpoints.level);
    
    // Skill Stats
    set('wc-level', s.woodcutting.level);
    set('wc-xp', Math.floor(s.woodcutting.xp));

    // Optional: Coin display update (redundant if inventory does it, but good safety)
    // const coins = document.getElementById('coin-display');
    // if(coins && window.gameState.inventory) ... 
}

// 2. CLOSE MODALS (Bank/Shop)
export function closeWindows() {
    const bank = document.getElementById('bank-window');
    const shop = document.getElementById('shop-window');
    
    if (bank) bank.style.display = 'none';
    if (shop) shop.style.display = 'none';
    
    // Reset interaction mode
    if (window.gameState) window.gameState.uiMode = 'normal';
}

// 3. SWITCH TABS (Inventory / Stats / Magic)
export function switchTab(tabId) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    // Show target panel
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}
