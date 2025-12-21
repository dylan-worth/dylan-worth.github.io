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
    if (!list) return;
    const line = document.createElement('div');
    line.style.color = color;
    line.style.textShadow = '1px 1px 0 #000';
    line.innerText = msg;
    list.appendChild(line);
    list.scrollTop = list.scrollHeight; 
}

function processCommand(text) {
    if (!text.startsWith('::')) {
        addChatMessage(`You: ${text}`, 'yellow');
        return;
    }

    // Clean up command: remove '::', lowercase, trim
    const fullCmd = text.substring(2).toLowerCase().trim();
    const parts = fullCmd.split(' ');
    const cmd = parts[0];
    const arg = parts[1]; // e.g., "lumbridge"

    if (cmd === 'debug') {
        runDebug();
    } 
    else if (cmd === 'bank') {
        if(window.game && window.game.openBank) {
            window.game.openBank();
            addChatMessage("Bank opened.", "lime");
        }
    }
    // TELEPORT COMMANDS
    else if (cmd === 'teleport' || cmd === 'tele') {
        handleTeleport(arg);
    }
    else if (cmd === 'teleport_falador') {
        window.game.teleport('falador');
    }
    else if (cmd === 'teleport_menaphos') {
        window.game.teleport('menaphos');
    }
    else {
        addChatMessage(`Unknown command: ${cmd}`, 'red');
    }
}

function handleTeleport(loc) {
    if (!loc) {
        addChatMessage("Usage: ::teleport [location]", "orange");
        return;
    }
    
    if (loc === 'lumbridge' || loc === 'lumby') {
        window.game.teleport('lumbridge');
    } else if (loc === 'falador' || loc === 'fally') {
        window.game.teleport('falador');
    } else if (loc === 'menaphos') {
        window.game.teleport('menaphos');
    } else {
        addChatMessage(`Unknown location: ${loc}`, "red");
    }
}

function runDebug() {
    addChatMessage("--- DEBUG REPORT ---", "cyan");
    const mods = [
        { name: 'Main', check: !!window.game },
        { name: 'Bank', check: !!window.game.deposit },
        { name: 'Shop', check: !!window.game.sell },
        { name: 'Inv', check: !!document.getElementById('inv-grid') }
    ];
    mods.forEach(m => {
        addChatMessage(`${m.name}: ${m.check ? 'OK' : 'FAIL'}`, m.check ? 'lime' : 'red');
    });
    
    if (window.gameState && window.gameState.player) {
        const p = window.gameState.player.position;
        addChatMessage(`Pos: ${p.x.toFixed(1)}, ${p.z.toFixed(1)}`, "white");
    } else {
        addChatMessage("Player: NOT FOUND", "red");
    }
}
