import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createTree, createNPC, createInteractable, createChessTable, createSnowPile, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';
import { getObjectById } from './id_map.js';

let hansNPC = null;
let currentHansTarget = 0;
const hansPath = [
    { x: 8.2,  z: 23.1 }, { x: -8.2, z: 23.1 }, 
    { x: -8.2, z: 15.0 }, { x: 8.2,  z: 15.0 }  
];

export async function buildLumbridge(scene) {
    // 1. STATIC ENVIRONMENT
    createGround(scene, 0x2d5a27); 
    createBuilding(scene, 'lum_castle', 0, -5); 
    createPath(scene, 0, 25, 6, 30);
    createPath(scene, 0, -35, 6, 30);
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);

    // 2. FETCH MULTIPLE DATA SOURCES
    try {
        const [treeRes, npcRes, objRes] = await Promise.all([
            fetch('./trees.json'),
            fetch('./npcs.json'),
            fetch('./objects.json')
        ]);

        const treeData = await treeRes.json();
        const npcData = await npcRes.json();
        const objData = await objRes.json();

        // Spawn Trees
        treeData.trees?.forEach(t => {
            const config = getObjectById(t.id);
            if (config) createTree(scene, config.name, t.x, t.z);
        });

        // Spawn NPCs
        npcData.npcs?.forEach(n => {
            const npc = createNPC(scene, n.type, n.x, n.z);
            if (n.type === 'hans') hansNPC = npc;
        });

        // Spawn Objects
        objData.objects?.forEach(obj => {
            if (obj.type === 'chess_table') createChessTable(scene, obj.x, obj.z);
            else if (obj.type === 'snow_pile') createSnowPile(scene, obj.x, obj.z);
            else createInteractable(scene, obj.type, obj.x, obj.z);
        });

    } catch (e) {
        console.error("Error loading world data files:", e);
    }

    // 3. FINAL SETUP
    setupGuards(scene);
    createLantern(scene, 6, 12);
    createLantern(scene, -6, 12);
}

function setupGuards(scene) {
    const guards = [
        createNPC(scene, 'man', -4, 14),
        createNPC(scene, 'man', 4, 14)
    ];
    guards.forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false;
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
    });

    setInterval(() => {
        if (!window.gameState.player) return;
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            if (dist < 6 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to Lumbridge!`, "white");
                guard.userData.hasGreeted = true;
                setTimeout(() => { guard.userData.hasGreeted = false; }, 45000);
            }
        });
    }, 1000);
}

export function updateHans() {
    if (!hansNPC) return;
    const target = hansPath[currentHansTarget];
    const dx = target.x - hansNPC.position.x;
    const dz = target.z - hansNPC.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.2) {
        currentHansTarget = (currentHansTarget + 1) % hansPath.length;
    } else {
        const speed = 0.035;
        hansNPC.position.x += (dx / dist) * speed;
        hansNPC.position.z += (dz / dist) * speed;
        hansNPC.rotation.y = Math.atan2(dx, dz);
    }
}
