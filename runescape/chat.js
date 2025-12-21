export function setupChat() {
    const input = document.getElementById('chat-input');
    
    // Listen for the "Enter" key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = input.value;
            if (text.trim() !== "") {
                processCommand(text);
                input.value = ''; // Clear input
            }
        }
    });
}

export function addChatMessage(msg, color = 'white') {
    const list = document.getElementById('chat-list');
    if (!list) return;

    const line = document.createElement('div');
    line.style.color = color;
    line.style.textShadow = '1px 1px 0 #000'; // Black outline for readability
    line.innerText = msg;
    
    list.appendChild(line);
    list.scrollTop = list.scrollHeight; // Auto-scroll to bottom
}

function processCommand(text) {
    // If it doesn't start with ::, just echo it as normal chat
    if (!text.startsWith('::')) {
        addChatMessage(`You: ${text}`, 'yellow');
        return;
    }

    // Parse Command
    const fullCmd = text.substring(2).toLowerCase().trim();
    const parts = fullCmd.split(' ');
    const cmd = parts[0];
    const arg = parts[1]; // e.g., "lumbridge"

    // --- COMMAND LIST ---

    if (cmd === 'debug') {
        runDebug();
    } 
    // NEW: Get Location
    else if (cmd === 'loc' || cmd === 'pos') {
        if (window.gameState && window.gameState.player) {
            const p = window.gameState.player.position;
            // Print to chat
            addChatMessage(`Coords: ${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`, "cyan");
            // Also print to console (F12) so you can copy-paste it into code easily
            console.log(`{ x: ${p.x.toFixed(2)}, z: ${p.z.toFixed(2)} }`); 
        } else {
            addChatMessage("Player not found.", "red");
        }
    }
    else if (cmd === 'bank') {
        if(window.game && window.game.openBank) {
            window.game.openBank();
            addChatMessage("Bank opened.", "lime");
        } else {
            addChatMessage("System error: Bank not found.", "red");
        }
    }
    else if (cmd === 'teleport' || cmd === 'tele') {
        handleTeleport(arg);
    }
    else if (cmd === 'smite') {
        if (window.game && window.game.smite) {
            window.game.smite();
        } else {
            addChatMessage("Smite system not ready.", "red");
        }
    }
    // Specific Teleport Shortcuts
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
    if (!window.game || !window.game.teleport) {
        addChatMessage("Teleport system offline.", "red");
        return;
    }

    if (!loc) {
        addChatMessage("Usage: ::tele [location]", "orange");
        return;
    }
    
    // Aliases
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
        { name: 'Smite', check: !!window.game.smite },
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
