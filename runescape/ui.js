export function updateStatsUI() {
    const s = window.gameState.skills;
    if (!s) return;
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
    set('stat-hp', s.hitpoints.level);
    set('wc-level', s.woodcutting.level);
    set('wc-xp', Math.floor(s.woodcutting.xp));
}

export function closeWindows() {
    const bank = document.getElementById('bank-window');
    const shop = document.getElementById('shop-window');
    const chess = document.getElementById('chess-window');
    
    if (bank) bank.style.display = 'none';
    if (shop) shop.style.display = 'none';
    if (chess) chess.style.display = 'none';
    
    if (window.gameState) window.gameState.uiMode = 'normal';
}

export function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => {
        if (!p.classList.contains('window')) p.classList.remove('active');
    });
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}
