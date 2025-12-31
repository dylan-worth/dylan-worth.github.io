export const PlayerState = {
    cash: 500,
    location: "Pallet Town",
    badges: [],
    inventory: ["Monster_01", "Monster_05"], // Indices from your sheet

    // Save data to browser memory
    save() {
        const data = JSON.stringify(this);
        localStorage.setItem('pokeQuest_save', data);
        console.log("Game Saved!");
    },

    // Load data when the game starts
    load() {
        const savedData = localStorage.getItem('pokeQuest_save');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.assign(this, parsed);
        }
    },

    addBadge(badgeName) {
        if (!this.badges.includes(badgeName)) {
            this.badges.push(badgeName);
            this.save();
        }
    }
};
