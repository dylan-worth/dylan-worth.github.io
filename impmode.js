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
        
        <h3>Young Impling Loot</h3>
        <ul>
            <li>11 Steel Axes</li>
            <li>2 Oak Planks</li>
            <li>3 Studded Chaps</li>
            <li>1 Steel Full Helm</li>
            <li>10 Meat Pizzas</li>
            <li>12 Coal</li>
            <li>15 Pure Essence</li>
            <li>1 Bowstring</li>
            <li>1 Tuna</li>
            <li>1 Snape Grass</li>
            <li>1 Seaweed</li>
            <li>2 Garden Pies</li>
            <li>65 Steel Nails</li>
            <li>1 Lockpick</li>
            <li>1 Defense Potion (3)</li>
            <li>1 Tooth Half of a Key</li>
        </ul>

        <h3>Baby Impling Loot</h3>
        <ul>
            <li>1 Chisel</li>
            <li>1 Hammer</li>
            <li>3 Thread</li>
            <li>1 Cheese</li>
            <li>1 Spices</li>
            <li>1 Knife</li>
            <li>1 Ball of Wool</li>
            <li>4 Needles</li>
        </ul>

        <h3>Random Event Loot</h3>
        <ul>
            <li>2 Triangle Sandwiches</li>
            <li>2 Mint Cakes</li>
            <li>1 Cake</li>
            <li>1 Chocolate Cake</li>
            <li>2 Uncut Sapphires</li>
            <li>1 Uncut Emerald</li>
        </ul>

        <h3>Minigame Loot</h3>
        <ul>
            <li>1 Spade</li>
            <li>1 Impling Scroll</li>
            <li>1 Imp Repellent</li>
            <li>100 Acorn Seeds</li>
            <li>10 Redberry Seeds</li>
        </ul>

        <h3>Cash</h3>
        <p>4.2k GP</p>
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