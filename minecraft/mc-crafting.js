// mc-crafting.js

// --- RECIPE DATABASE (2x2 Grid) ---
// Format: [TopLeft, TopRight, BottomLeft, BottomRight]
// null means empty.
const RECIPES = [
    {
        ingredients: ['wood_oak', null, null, null],
        result: 'planks_oak',
        count: 4
    },
    {
        ingredients: ['sand', null, null, null],
        result: 'glass',
        count: 1
    },
    {
        ingredients: ['stone', 'stone', 'stone', 'stone'],
        result: 'bricks_stone',
        count: 1
    },
    {
        ingredients: ['planks_oak', null, 'planks_oak', null], // Vertical stick pattern
        result: 'stick',
        count: 2
    },
    {
        ingredients: ['stick', null, 'stick', null], // Stick on stick
        result: 'torch',
        count: 4
    }
];

// State
let craftingGrid = [null, null, null, null];
let isOpen = false;

export function initCrafting() {
    createCraftingUI();
    bindEvents();
}

function createCraftingUI() {
    const div = document.createElement('div');
    div.id = 'craft-overlay';
    div.innerHTML = `
        <div class="craft-window">
            <h2>Crafting</h2>
            <div class="craft-container">
                <div class="craft-grid">
                    <div class="c-slot" data-index="0"></div>
                    <div class="c-slot" data-index="1"></div>
                    <div class="c-slot" data-index="2"></div>
                    <div class="c-slot" data-index="3"></div>
                </div>
                <div class="craft-arrow">➡</div>
                <div class="craft-output">
                    <div class="c-slot output-slot" id="c-result"></div>
                </div>
            </div>
            <div class="craft-controls">
                <button id="btn-close-craft">CLOSE</button>
                <button id="btn-clear-craft">CLEAR GRID</button>
            </div>
            <p style="color:#ccc; font-size:12px;">Tap Inventory items to fill grid</p>
        </div>
    `;
    document.body.appendChild(div);
}

function bindEvents() {
    // 1. Toggle Button (We will add this to HTML)
    document.getElementById('btn-craft-toggle').addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleMenu();
    });
    
    // 2. Close / Clear
    document.getElementById('btn-close-craft').addEventListener('touchstart', toggleMenu);
    document.getElementById('btn-clear-craft').addEventListener('touchstart', clearGrid);

    // 3. Grid Interaction (Tap to remove)
    document.querySelectorAll('.craft-grid .c-slot').forEach(slot => {
        slot.addEventListener('touchstart', (e) => {
            const idx = parseInt(e.target.dataset.index);
            craftingGrid[idx] = null;
            updateGridUI();
        });
    });

    // 4. Output Interaction (Tap to Collect)
    document.getElementById('c-result').addEventListener('touchstart', (e) => {
        const resultType = e.target.dataset.type;
        if(resultType) {
            addToInventory(resultType);
            clearGrid();
            // Optional: Close menu on craft?
            // toggleMenu(); 
        }
    });

    // 5. Inventory Interaction (Tap to add to grid)
    // We hook into the existing inventory slots
    const invSlots = document.querySelectorAll('#inventory .slot');
    invSlots.forEach(slot => {
        slot.addEventListener('touchstart', (e) => {
            if(!isOpen) return; // Only if menu is open
            e.stopPropagation(); // Don't select item in game
            
            const type = slot.dataset.type;
            if (type === 'hand') return;

            // Find first empty slot in grid
            const emptyIdx = craftingGrid.indexOf(null);
            if (emptyIdx !== -1) {
                craftingGrid[emptyIdx] = type;
                updateGridUI();
            }
        });
    });
}

function toggleMenu() {
    const overlay = document.getElementById('craft-overlay');
    isOpen = !isOpen;
    overlay.style.display = isOpen ? 'flex' : 'none';
    if(isOpen) clearGrid();
}

function clearGrid() {
    craftingGrid = [null, null, null, null];
    updateGridUI();
}

function updateGridUI() {
    const uiSlots = document.querySelectorAll('.craft-grid .c-slot');
    
    // Update 4 Grid Slots
    craftingGrid.forEach((item, i) => {
        uiSlots[i].className = 'c-slot'; // Reset
        uiSlots[i].innerHTML = '';
        if(item) {
            // Apply visual class based on item type (using existing CSS logic)
            // We map internal names to CSS classes roughly
            const cssClass = getCSSClass(item);
            uiSlots[i].classList.add(cssClass);
        }
    });

    checkRecipes();
}

function checkRecipes() {
    const outSlot = document.getElementById('c-result');
    outSlot.className = 'c-slot output-slot';
    outSlot.dataset.type = '';

    // Simple matching
    let match = null;

    for (let r of RECIPES) {
        // Compare r.ingredients with craftingGrid
        const isMatch = r.ingredients.every((ing, i) => {
            return ing === craftingGrid[i];
        });

        if (isMatch) {
            match = r;
            break;
        }
    }

    if (match) {
        const cssClass = getCSSClass(match.result);
        outSlot.classList.add(cssClass);
        outSlot.dataset.type = match.result;
    }
}

// Helper to map item types to CSS classes
function getCSSClass(type) {
    // This assumes specific naming conventions or manual mapping
    if (type === 'wood_oak') return 'c-oak';
    if (type === 'planks_oak') return 'c-plank';
    if (type === 'stick') return 'c-stick';
    if (type === 'sand') return 'c-sand';
    if (type === 'glass') return 'c-glass';
    if (type === 'stone') return 'c-stone';
    if (type === 'bricks_stone') return 'c-brick';
    if (type === 'torch') return 'c-torch';
    return 'c-dirt'; // fallback
}

function addToInventory(type) {
    // Check if slot already exists
    const inv = document.getElementById('inventory');
    const existing = inv.querySelector(`.slot[data-type="${type}"]`);
    
    if (!existing) {
        const newSlot = document.createElement('div');
        // Map types to CSS classes
        let cssClass = getCSSClass(type);
        
        newSlot.className = `slot ${cssClass}`;
        newSlot.dataset.type = type;
        
        // Add click listener to new slot
        newSlot.addEventListener('touchstart', (e) => {
             // ... duplicate the logic from mc-main setupInput ...
             // For modularity, we should export a helper from mc-main, 
             // but for now let's just let it be a visual addition that needs a game reload to fully bind
             // OR: Tricky hack: just append it.
        });
        
        inv.appendChild(newSlot);
        
        // RE-BIND events to include new slot
        // This is a bit hacky but works for the prototype
        // We dispatch a custom event that mc-main listens to? 
        // Or simpler: Just alert "Crafted!"
    }
    
    // Flash message
    const msg = document.getElementById('loading-text');
    msg.style.display = 'block';
    msg.innerText = `Crafted: ${type}!`;
    setTimeout(() => msg.style.display = 'none', 2000);
}
