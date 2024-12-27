// Content data
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
        <ul>
            <li>Steel Axe</li>
            <li>Hammer</li>
            <li>Chisel</li>
            <li>Uncut Emerald</li>
            <li>Uncut Sapphire</li>
            <li>Food from implings</li>
            <li>Holiday Cakes</li>
        </ul>
    `,
    stats: `
        <h2>Stats</h2>
        <ul>
            <li>Attack: 13</li>
            <li>Strength: 10</li>
            <li>Defense: 15</li>
            <li>Hitpoints: 16</li>
            <li>Slayer: 10</li>
            <li>Farming: 37</li>
            <li>Hunter: 24</li>
        </ul>
    `
};

// Function to change content dynamically
function changeContent() {
    const menu = document.getElementById('menu');
    const selectedValue = menu.value;
    const contentSection = document.getElementById('content');
    contentSection.innerHTML = content[selectedValue];
}