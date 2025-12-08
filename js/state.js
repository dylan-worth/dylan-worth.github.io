export const STATE = {
    // Stats
    level: 1,
    xp: 0,
    
    // Inventory
    wood: 0,
    berries: 0,
    rawMeat: 0,
    cookedMeat: 0,
    
    axeBroken: false,
    flashlight: true,
    
    // Config
    zoom: 20,
    time: 0.5, 
    location: 'OUTSIDE',
    
    // Interaction Targets
    nearbyTree: null,
    nearbyBush: null,
    nearbyRabbit: null,
    nearbyFire: false,
    nearbyPOI: null
};

export const CONFIG = {
    mapRadius: 50,
    maxLevel: 99,
    maxXP: 1000000,
    cabinPos: { x: -10, y: 0, z: -15 }
};
