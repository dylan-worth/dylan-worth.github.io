/* 99tools.js - Item Stats & Logic */

const Tools = {
    // AXES (Tree HP is standard 15)
    Axes: {
        'Old Axe':     { damage: 1,  icon: '🪓', color: 0x8d6e63 }, // 15 hits
        'Good Axe':    { damage: 3,  icon: '⚒️', color: 0x95a5a6 }, // 5 hits
        'Great Axe':   { damage: 15, icon: '⚔️', color: 0xf1c40f }, // 1 hit
        'Chainsaw':    { damage: 15, icon: '⚙️', color: 0xe67e22 }  // 1 hit
    },

    // FLASHLIGHTS (Duration in seconds)
    Flashlights: {
        'Old Flashlight':    { duration: 30, range: 40, intensity: 1.2, color: 0xffaa00 },
        'Good Flashlight':   { duration: 50, range: 60, intensity: 1.5, color: 0xffffff },
        'Strong Flashlight': { duration: 70, range: 80, intensity: 2.0, color: 0xaaffff }
    },

    // SACKS (Capacity)
    Sacks: {
        'Old Sack':   { capacity: 10 },
        'Good Sack':  { capacity: 20 },
        'Great Sack': { capacity: 50 }
    },

    // Helpers
    getDamage: function(name) {
        return this.Axes[name] ? this.Axes[name].damage : 1;
    },
    
    getBatteryDrain: function(name) {
        // Returns drain per second to empty 100% battery over duration
        const tool = this.Flashlights[name];
        return tool ? (100 / tool.duration) : (100 / 30);
    },

    getCapacity: function(name) {
        return this.Sacks[name] ? this.Sacks[name].capacity : 10;
    }
};
