// chat.js
export function setupChat() {
    const input = document.getElementById('chat-input');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(input.value);
            input.value = '';
        }
    });
}

export function addChatMessage(msg, color = 'white') {
    const list = document.getElementById('chat-list');
    const line = document.createElement('div');
    line.style.color = color;
    line.style.textShadow = '1px 1px 0 #000';
    line.innerText = msg;
    list.appendChild(line);
    list.scrollTop = list.scrollHeight; // Auto scroll
}

function processCommand(text) {
    if (!text.startsWith('::')) {
        // Normal chat (just print it for now)
        addChatMessage(`You: ${text}`, 'yellow');
        return;
    }

    const cmd = text.substring(2).toLowerCase().trim();

    if (cmd === 'debug') {
        runDebug();
    } else if (cmd === 'bank') {
        // Cheat command
        window.game.openBank(); 
        addChatMessage("Debug: Bank opened.", "lime");
    } else {
        addChatMessage(`Unknown command: ${cmd}`, 'red');
    }
}

function runDebug() {
    addChatMessage("--- DEBUG REPORT ---", "cyan");
    
    // Check Modules
    const mods = [
        { name: 'Main', check: !!window.game },
        { name: 'Bank', check: !!window.game.deposit },
        { name: 'Shop', check: !!window.game.sell },
        { name: 'Inv', check: !!document.getElementById('inv-grid') }
    ];

    mods.forEach(m => {
        addChatMessage(`${m.name}: ${m.check ? 'OK' : 'FAIL'}`, m.check ? 'lime' : 'red');
    });

    // Check Player
    if (window.gameState && window.gameState.player) {
        const p = window.gameState.player.position;
        addChatMessage(`Pos: ${p.x.toFixed(1)}, ${p.z.toFixed(1)}`, "white");
    } else {
        addChatMessage("Player: NOT FOUND", "red");
    }
    
    addChatMessage("Check F12 Console for errors.", "yellow");
}
