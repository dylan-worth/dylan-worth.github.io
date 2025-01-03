// Content for each tab
const content = {
    rules: `
        <h2>Rules</h2>
        <p>Welcome to my unique Iron Man challenge! Here are the rules I follow:</p>
        <ul>
            <li>Everything must be obtained through RNG (e.g., clue scrolls, random events, implings, and minigames).</li>
            <li>Shops are not allowed except for purchases made inside minigames.</li>
            <li>Combat must follow strict guidelines: Slayer tasks or bosses only.</li>
            <li>Woodcutting can only be done on trees I grow myself.</li>
            <li>Farming is allowed, but seeds must come from RNG sources.</li>
            <li>Mining is limited to Shooting Stars.</li>
            <li>Smithing is only possible with materials looted through RNG.</li>
            <li>Clue scroll rewards must align with my progression.</li>
        </ul>
    `,
    progress: `
        <h2>Progress</h2>
        <h3>Day 1: The Journey Begins</h3>
        <p>🎂 Holiday Randoms: Received a White Cake and Mint Cake.</p>
        <p>💰 Giles: Gave me 80 coins—not much, but it’s a start.</p>
        <p>☃️ Snowman Random: Had to turn it away.</p>
        <p>🐧 Penguin Points: Started collecting but paused due to work.</p>

        <h3>Day 2: Slayer and Regrets</h3>
        <p>⚔️ Completed my first Slayer task: 15 Seagulls. Reached 4 Attack.</p>
        <p>🌟 Random Events: Genie Lamps into Agility, and earned a Camo Hat from Drill Sergeant.</p>
        <p>🐧 Used 9 Penguin Points on Magic XP, reaching Level 3—but regretted it!</p>

        <h3>Day 3: First Death and Hard Lessons</h3>
        <p>⚔️ Reached 8 Attack, 5 Strength, and started Defense. First death happened!</p>
        <p>🌟 Focused Genie Lamps on Mining XP to unlock Shooting Stars.</p>
        <p>🎯 Grinding for clue scrolls and saving GP for Ogre Roots.</p>

        <h3>Day 4: Big Hits and New Tasks</h3>
        <p>⚔️ Completed Goblin Slayer tasks. Hit my first 2 damage on a goblin!</p>
        <p>💎 Random Events: Received uncut emerald and sapphire from Giles.</p>
        <p>🎂 Got a Chocolate Cake from the holiday event, ate it during combat.</p>

        <h3>Day 5: Implings and Monkeys</h3>
        <p>⚔️ Attack: 13 | Strength: 10 | Defense: 15 | Hitpoints: 16 | Slayer: 10.</p>
        <p>🌱 Farming 37, Hunter 24. Impling loot: Steel Axe, Hammer, Chisel, food.</p>
        <p>🐧 Penguin Points funded new activities.</p>
    `,


    bank: `
        <h2>Bank</h2>
        <p>Here’s what I’ve collected so far:</p>
        
        <h3>Currency</h3>
        <ul>
            <li>9,800 coins</li>
            <li>1,400 Tokkul</li>
        </ul>

        <h3>Food</h3>
        <ul>
            <li>2 Mint Cakes</li>
            <li>1 Cheese</li>
            <li>2 Spices</li>
            <li>2 Kebabs</li>
            <li>1 Triangle Sandwich</li>
            <li>1 Live Pie</li>
            <li>4 Tuna</li>
            <li>2 Bass</li>
            <li>15 Rainbow Fish</li>
            <li>6 Meat Pizza</li>
            <li>1 Cake</li>
            <li>4 Chocolate Cakes</li>
            <li>7 Curry</li>
            <li>8 Meat Pies</li>
            <li>24 Garden Pies</li>
            <li>1 Fish Pie</li>
            <li>4 Lobsters</li>
            <li>3 Sharks</li>
            <li>3 Swordfish</li>
            <li>6 Karambwan</li>
            <li>1 Chef's Delight</li>
        </ul>

        <h3>Potions</h3>
        <ul>
            <li>2 Defense Potions</li>
        </ul>

        <h3>Tools and Crafting Items</h3>
        <ul>
            <li>140 Steel Nails</li>
            <li>1 Chisel</li>
            <li>4 Needles</li>
            <li>1 Hammer</li>
            <li>3 Threads</li>
            <li>1 Knife</li>
            <li>6 Balls of Wool</li>
            <li>3 Oak Planks</li>
            <li>2 Soft Clay</li>
            <li>1 Bowstring</li>
            <li>1 Saw (from the Sawmill)</li>
        </ul>

        <h3>Keys and Locks</h3>
        <ul>
            <li>1 Tooth Half-Key</li>
            <li>1 Lockpick</li>
        </ul>

        <h3>Impling and Slayer Items</h3>
        <ul>
            <li>2 Impling Jars</li>
            <li>1 Earth Impling Jar</li>
            <li>2 Gourmet Impling Jars</li>
            <li>1 Essence Impling Jar</li>
            <li>1 Enchanted Gem</li>
            <li>1 Impling Scroll</li>
        </ul>

        <h3>Clothing and Gear</h3>
        <ul>
            <li>1 Camo Hat</li>
            <li>1 Steel Full Helmet</li>
            <li>19 Steel Axes</li>
            <li>3 Studded Chaps</li>
            <li>1 Blue Skirt</li>
            <li>1 Red Elegant</li>
            <li>1 Black Elegant</li>
            <li>1 Sheep Mask</li>
            <li>1 Adamant Platebody (Gold-Trimmed)</li>
            <li>1 Adamant Shield (H2)</li>
            <li>1 Adamant Square Shield</li>
            <li>1 Guthix Cloak</li>
            <li>1 Saradomin Cloak</li>
        </ul>

        <h3>Weapons</h3>
        <ul>
            <li>1 Yew Longbow</li>
        </ul>

        <h3>Runes and Talismans</h3>
        <ul>
            <li>25 Mind Runes</li>
            <li>30 Air Runes</li>
            <li>158 Water Runes</li>
            <li>1,952 Earth Runes</li>
            <li>150 Fire Runes</li>
            <li>13 Death Runes</li>
            <li>4 Cosmic Runes</li>
            <li>28 Body Runes</li>
            <li>8 Chaos Runes</li>
            <li>4 Lava Runes</li>
            <li>1 Air Talisman</li>
            <li>1 Mind Talisman</li>
            <li>1 Earth Talisman</li>
            <li>1 Fire Talisman</li>
            <li>2 Earth Tiaras</li>
            <li>48 Pure Essence</li>
        </ul>

        <h3>Gems and Bars</h3>
        <ul>
            <li>1 Uncut Emerald</li>
            <li>2 Uncut Sapphires</li>
            <li>1 Uncut Ruby</li>
            <li>16 Emeralds</li>
            <li>1 Sapphire</li>
            <li>7 Rubies</li>
            <li>48 Gold Bars</li>
            <li>72 Coal</li>
            <li>62 Mithril Ore</li>
            <li>7 Mithril Pickaxes</li>
            <li>1 Mithril Bar</li>
            <li>4 Steel Bars</li>
        </ul>

        <h3>Herblore and Farming Items</h3>
        <ul>
            <li>50 Unicorn Horns</li>
            <li>3 Snape Grass</li>
            <li>1 Jangerberry</li>
            <li>1 Seaweed</li>
            <li>1 Flax</li>
            <li>396 Compost</li>
            <li>12 Super Compost</li>
            <li>200 Buckets of Sand</li>
        </ul>

        <h3>Treasure Trail Items</h3>
        <ul>
            <li>Zamorak Page 1</li>
            <li>Zamorak Page 3</li>
            <li>Zamorak Page 4</li>
            <li>1 Medium Clue Scroll</li>
        </ul>

        <h3>Miscellaneous</h3>
        <ul>
            <li>1 Imp Repellent</li>
            <li>100 Acorns</li>
            <li>10 Redberry Seeds</li>
            <li>1 Frog Spawn</li>
            <li>4 Bowls</li>
            <li>2 Pie Dishes (from curry and pies)</li>
            <li>1 Roll</li>
        </ul>
    `,
    stats: `
        <h2>Stats</h2>
        <ul>
            <li>Attack: 15</li>
            <li>Strength: 15</li>
            <li>Defense: 15</li>
            <li>Hitpoints: 17</li>
            <li>Slayer: 12</li>
            <li>Farming: 37</li>
            <li>Hunter: 26</li>
            <li>Magic: 4</li>
        </ul>
    `
};

// Function to change content dynamically
function showTab(tabName) {
    const contentSection = document.getElementById('content');
    contentSection.innerHTML = content[tabName];

    // Update active button styling
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}