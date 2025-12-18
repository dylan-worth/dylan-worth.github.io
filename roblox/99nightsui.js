/* 99nightsui.js - Core Game State & UI Manager */

// --- 1. GAME STATE (The Memory) ---
const gameState = {
    wood: 0,
    maxWood: 10,
    xp: 0,
    xpToNextLevel: 100,
    campLevel: 1,
    time: 0.5, // Start at Noon
    day: 1,
    nearbyObject: null, // 'tree', 'fire', 'bench'
    isSwinging: false,
    velocityY: 0,
    isGrounded: true,
    hasMap: false,
    fogDist: 25,
    // Input State
    moveX: 0,
    moveY: 0,
    lookDeltaX: 0,
    lookDeltaY: 0,
    jumpPressed: false,
    actionPressed: false
};

// --- 2. INVENTORY SYSTEM ---
const Inventory = {
    slots: [
        { id: 'item-axe', icon: '🪓', name: 'Axe', count: 1, type: 'tool' },
        { id: 'item-sack', icon: '🎒', name: 'Sack', count: 0, max: 10, type: 'storage' },
        null, // Slot 2 (Empty)
        null, // Slot 3 (Empty)
        null  // Slot 4 (Empty)
    ],

    // Update the visual HTML to match data
    render: function() {
        const bar = document.getElementById('inventory-bar');
        bar.innerHTML = ''; // Clear current

        this.slots.forEach((item, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'inv-slot';
            slotDiv.id = `slot-${index}`;
            
            // Drag Events
            slotDiv.ondrop = (e) => Inventory.handleDrop(e, index);
            slotDiv.ondragover = (e) => e.preventDefault();

            if (item) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-icon';
                itemDiv.draggable = true;
                itemDiv.id = item.id;
                itemDiv.innerHTML = item.icon;
                
                // Drag Start
                itemDiv.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", index);
                };

                // Sack Count Overlay
                if (item.type === 'storage') {
                    const countDiv = document.createElement('div');
                    countDiv.className = 'item-count';
                    countDiv.innerText = `${gameState.wood}/${gameState.maxWood}`;
                    itemDiv.appendChild(countDiv);
                }

                slotDiv.appendChild(itemDiv);
            }
            bar.appendChild(slotDiv);
        });
    },

    handleDrop: function(e, targetIndex) {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
        
        // Swap Logic
        if (fromIndex !== targetIndex && !isNaN(fromIndex)) {
            const temp = this.slots[targetIndex];
            this.slots[targetIndex] = this.slots[fromIndex];
            this.slots[fromIndex] = temp;
            this.render(); // Re-render UI
        }
    },

    addWood: function(amount) {
        if (gameState.wood < gameState.maxWood) {
            gameState.wood += amount;
            // Update sack count visualization
            this.render(); 
            return true;
        }
        return false;
    }
};

// --- 3. UI MANAGER ---
const UI = {
    showToast: function(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => t.style.opacity = 0, 2000);
    },

    updateHUD: function() {
        // XP Bar
        const pct = (gameState.xp / gameState.xpToNextLevel) * 100;
        document.getElementById('xp-bar-fill').style.width = Math.min(100, pct) + '%';
        
        // Time
        let hour = Math.floor(gameState.time * 24);
        let ampm = hour >= 12 ? 'PM' : 'AM';
        let dHour = hour % 12 || 12;
        document.getElementById('time-display').innerText = `Day ${gameState.day} - ${dHour}:00 ${ampm}`;
        
        // Level
        document.getElementById('camp-lvl').innerText = gameState.campLevel;
    },

    toggleCraftMenu: function(show) {
        document.getElementById('craft-menu').style.display = show ? 'block' : 'none';
    },

    toggleActionBtn: function(show, icon) {
        const btn = document.getElementById('action-btn');
        if (show) {
            btn.style.display = 'flex';
            btn.innerText = icon;
        } else {
            btn.style.display = 'none';
        }
    },

    // Minimap Rendering (Called from game loop)
    drawMinimap: function(playerPos, objects) {
        if (!gameState.hasMap) return;
        
        const canvas = document.getElementById('minimap-canvas');
        if (canvas.style.display === 'none') canvas.style.display = 'block';
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 100, 100);
        
        // Background
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, 100, 100);
        
        // Player (Center)
        ctx.fillStyle = "#00b06f";
        ctx.beginPath(); 
        ctx.arc(50, 50, 4, 0, Math.PI * 2); 
        ctx.fill();

        // Objects relative to player
        // Scale: 1 world unit = 1 pixel
        objects.forEach(obj => {
            const dx = obj.pos.x - playerPos.x;
            const dz = obj.pos.z - playerPos.z;
            
            // Only draw if within map range (50 units)
            if (Math.abs(dx) < 50 && Math.abs(dz) < 50) {
                const mapX = 50 + dx;
                const mapY = 50 + dz;
                
                ctx.fillStyle = obj.color;
                ctx.fillRect(mapX - 2, mapY - 2, 4, 4);
            }
        });
    }
};

// --- 4. INPUT MANAGER (Joystick & Touch) ---
const Input = {
    init: function() {
        // Joystick Setup
        this.joyZone = document.getElementById('joystick-zone');
        this.joyKnob = document.getElementById('joystick-knob');
        
        this.joyZone.addEventListener('touchstart', e => this.handleJoy(e.touches[0].clientX, e.touches[0].clientY));
        this.joyZone.addEventListener('touchmove', e => { 
            e.preventDefault(); 
            this.handleJoy(e.touches[0].clientX, e.touches[0].clientY); 
        });
        this.joyZone.addEventListener('touchend', () => this.resetJoy());

        // Touch Layer (Look & Tap)
        this.touchLayer = document.getElementById('touch-layer');
        this.lastX = 0; this.lastY = 0;
        
        this.touchLayer.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                // Pass tap coordinates to main game for Raycasting
                if(window.gameCheckTap) window.gameCheckTap(e.touches[0].clientX, e.touches[0].clientY);
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            }
        });

        this.touchLayer.addEventListener('touchmove', e => {
            if (e.touches.length === 1) {
                e.preventDefault();
                const dx = e.touches[0].clientX - this.lastX;
                const dy = e.touches[0].clientY - this.lastY;
                gameState.lookDeltaX = dx;
                gameState.lookDeltaY = dy;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            }
        });
        
        this.touchLayer.addEventListener('touchend', () => {
            gameState.lookDeltaX = 0;
            gameState.lookDeltaY = 0;
        });
    },

    handleJoy: function(x, y) {
        const rect = this.joyZone.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        let dx = x - cx;
        let dy = y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 50;
        
        if (dist > maxDist) {
            dx *= maxDist / dist;
            dy *= maxDist / dist;
        }
        
        this.joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        
        // Update Game State (-1 to 1)
        gameState.moveX = dx / maxDist;
        gameState.moveY = dy / maxDist;
    },

    resetJoy: function() {
        this.joyKnob.style.transform = `translate(-50%, -50%)`;
        gameState.moveX = 0;
        gameState.moveY = 0;
    }
};

// --- 5. GAME ACTIONS ---
function jumpAction(e) {
    if(e) e.stopPropagation();
    if (gameState.isGrounded) {
        gameState.velocityY = 0.3;
        gameState.isGrounded = false;
    }
}

function interactAction(e) {
    if(e) e.stopPropagation();
    
    // Trigger visual swing
    gameState.isSwinging = true; // Main loop handles animation

    if (gameState.nearbyObject) {
        const obj = gameState.nearbyObject;
        
        if (obj.type === 'tree') {
            // Tree Logic handled in main loop based on isSwinging
        } 
        else if (obj.type === 'fire') {
            if (gameState.wood > 0) {
                gameState.wood--;
                gameState.xp += 20;
                checkLevelUp();
                UI.showToast("Fire Fueled! +20 XP");
                Inventory.render();
            } else {
                UI.showToast("Sack is empty!");
            }
        }
        else if (obj.type === 'bench') {
            UI.toggleCraftMenu(true);
        }
    }
}

function craftItem(item) {
    if (item === 'map') {
        if (gameState.wood >= 5) {
            gameState.wood -= 5;
            gameState.hasMap = true;
            document.getElementById('minimap-container').style.display = 'block';
            UI.showToast("Map Crafted!");
        } else UI.showToast("Need 5 Wood");
    } 
    else if (item === 'bed') {
        if (gameState.wood >= 10) {
            gameState.wood -= 10;
            UI.showToast("Bed Crafted (Spawn Set)");
        } else UI.showToast("Need 10 Wood");
    }
    else if (item === 'upgrade_bench') {
        if (gameState.wood >= 20) {
            gameState.wood -= 20;
            UI.showToast("Bench Upgraded!");
        } else UI.showToast("Need 20 Wood");
    }
    
    Inventory.render();
    UI.toggleCraftMenu(false);
}

function checkLevelUp() {
    if (gameState.xp >= gameState.xpToNextLevel) {
        gameState.campLevel++;
        gameState.xp = 0;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
        gameState.fogDist += 15; // Push fog back
        UI.showToast(`Campfire Lv ${gameState.campLevel}! Fog receding.`);
    }
    UI.updateHUD();
}

// Initialize on Load
window.addEventListener('load', () => {
    Input.init();
    Inventory.render();
    UI.updateHUD();
});
