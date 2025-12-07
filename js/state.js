// Global Game State
export const STATE = {
    // Stats
    level: 1,
    xp: 0,
    health: 100,
    hunger: 100,
    
    // Inventory
    wood: 0,
    berries: 0,
    axeBroken: false,
    flashlight: true,
    
    // Config
    zoom: 20,
    time: 0.5, // 0.5 = Noon
    location: 'OUTSIDE',
    
    // Interaction Targets (References to 3D objects)
    nearbyTree: null,
    nearbyBush: null,
    nearbyPOI: null
};

export const CONFIG = {
    mapRadius: 50,
    maxLevel: 99,
    maxXP: 1000000,
    cabinPos: { x: -10, y: 0, z: -15 }
};
