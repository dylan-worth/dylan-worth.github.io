import { initAudio, playSound } from './mc-audio.js';
import { createSky } from './mc-skybox.js';
import { updateDayNight } from './mc-cycle.js';
import { updateHydro, spawnWhirlpools } from './mc-water.js';
import { updateMobs } from './mc-entity.js';
import { initWorld, generateRow, createBlock, blockMap, objects, WORLD_RADIUS } from './mc-world.js';

// --- GLOBALS ---
let scene, camera, renderer;
let player = new THREE.Object3D();
let head = new THREE.Object3D();
let sunLight;
let raycaster = new THREE.Raycaster();

// Physics State
let velocity = new THREE.Vector3();
let moveFwd = 0, moveSide = 0;
let onGround = false, isInWater = false;
let currentMat = 'hand';

// --- BREAKING ANIMATION STATE ---
let isHolding = false;
let breakStartTime = 0;
let breakTarget = null; // The block we are currently breaking
let breakMesh = null; // The visual wireframe
const BREAK_DURATION = 600; // Time in ms to break a block

// Async Gen
let genX = -WORLD_RADIUS;

document.getElementById('btn-start').addEventListener('click', () => {
    initAudio();
    init();
    document.getElementById('btn-start').style.display = 'none';
});

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcce0ff, 10, 35);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 90);
    head.position.y = 1.6;
    head.add(camera);
    player.add(head);
    scene.add(player);
    player.position.set(0, 15, 0);

    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    document.getElementById('game-container').appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(amb);
    sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(0, 100, 0);
    scene.add(sunLight);

    // Initialize Modules
    createSky(player);
    initWorld(scene);
    
    // Create the Breaking Overlay Mesh
    const breakGeo = new THREE.BoxGeometry(1.01, 1.01, 1.01);
    const breakMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0 });
    breakMesh = new THREE.Mesh(breakGeo, breakMat);
    scene.add(breakMesh); // Add it to scene, but keep it invisible/hidden initially

    setupInput();
    generateBatch();
    
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function generateBatch() {
    if (genX > WORLD_RADIUS) {
        document.getElementById('start-screen').style.display = 'none';
        spawnWhirlpools(scene, WORLD_RADIUS);
        return;
    }
    const start = performance.now();
    while (performance.now() - start < 15 && genX <= WORLD_RADIUS) {
        generateRow(genX);
        genX++;
    }
    document.getElementById('loading-text').innerText = `Building World... ${Math.floor(((genX+WORLD_RADIUS)/(WORLD_RADIUS*2))*100)}%`;
    requestAnimationFrame(generateBatch);
}

function animate() {
    requestAnimationFrame(animate);
    
    updateDayNight(sunLight, scene.fog);
    updateMobs();
    const inWhirlpool = updateHydro(player, velocity, isInWater);
    updatePhysics(inWhirlpool);
    updateBreakingAnimation(); // New function called every frame
    
    renderer.render(scene, camera);
}

// --- NEW BREAKING LOGIC ---
function updateBreakingAnimation() {
    if (isHolding && breakTarget) {
        const elapsed = Date.now() - breakStartTime;
        const progress = Math.min(elapsed / BREAK_DURATION, 1.0);
        
        // 1. Move Break Mesh to target
        breakMesh.position.copy(breakTarget.position);
        breakMesh.visible = true;

        // 2. Animate opacity/scale based on progress
        // This simulates the "cracks" getting bigger
        breakMesh.material.opacity = 0.2 + (progress * 0.8);
        
        // Jiggle effect for feedback
        const jiggle = Math.sin(Date.now() * 0.05) * 0.02;
        breakMesh.scale.set(1.01 + jiggle, 1.01 + jiggle, 1.01 + jiggle);

        // 3. Break Check
        if (progress >= 1.0) {
            finishBreak();
        }
    } else {
        breakMesh.visible = false;
        breakMesh.scale.set(1.01, 1.01, 1.01);
    }
}

function startBreak() {
    // Find what we are looking at
    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
    const hits = raycaster.intersectObjects(objects);
    
    if (hits.length > 0 && hits[0].distance < 6) {
        const hit = hits[0];
        if(hit.object.userData.type === 'water') return; // Cannot break water

        breakTarget = hit.object;
        isHolding = true;
        breakStartTime = Date.now();
    }
}

function finishBreak() {
    if (!breakTarget) return;

    // Remove logic
    scene.remove(breakTarget);
    objects.splice(objects.indexOf(breakTarget), 1);
    blockMap.delete(`${Math.round(breakTarget.position.x)},${Math.round(breakTarget.position.y)},${Math.round(breakTarget.position.z)}`);
    playSound('break');

    // Create Particles
    createParticles(breakTarget.position, breakTarget.material.color);

    // Reset
    isHolding = false;
    breakTarget = null;
    breakMesh.visible = false;
}

function createParticles(pos, color) {
    const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    for(let i=0; i<8; i++) {
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        p.position.x += (Math.random()-0.5)*0.8;
        p.position.y += (Math.random()-0.5)*0.8;
        p.position.z += (Math.random()-0.5)*0.8;
        scene.add(p);
        
        // Animate out (simple cleanup)
        setTimeout(() => scene.remove(p), 400);
    }
}

function updatePhysics(inWhirlpool) {
    if (!inWhirlpool && !isInWater) velocity.y -= 0.012; // Gravity

    // Movement
    const yaw = player.rotation.y;
    const fx = -Math.sin(yaw) * moveFwd; const fz = -Math.cos(yaw) * moveFwd;
    const rx = -Math.cos(yaw) * moveSide; const rz = Math.sin(yaw) * moveSide;
    const dx = (fx + rx) * 0.14; const dz = (fz + rz) * 0.14;

    if (!checkColl(player.position.x + dx, player.position.y, player.position.z) && 
        !checkColl(player.position.x + dx, player.position.y - 1, player.position.z)) {
        player.position.x += dx;
    }
    if (!checkColl(player.position.x, player.position.y, player.position.z + dz) && 
        !checkColl(player.position.x, player.position.y - 1, player.position.z + dz)) {
        player.position.z += dz;
    }

    let nextY = player.position.y + velocity.y;
    if (velocity.y < 0 && checkColl(player.position.x, nextY - 1.5, player.position.z)) {
        velocity.y = 0; onGround = true;
        player.position.y = Math.round(nextY - 1.5) + 1.5 + 0.001;
    } else {
        player.position.y = nextY; onGround = false;
    }
    
    const headB = blockMap.get(`${Math.round(player.position.x)},${Math.round(player.position.y)},${Math.round(player.position.z)}`);
    const footB = blockMap.get(`${Math.round(player.position.x)},${Math.round(player.position.y-1)},${Math.round(player.position.z)}`);
    isInWater = (headB && headB.userData.type === 'water') || (footB && footB.userData.type === 'water');
    
    if (player.position.y < -15) player.position.set(0, 20, 0);
}

function checkColl(x, y, z) {
    const b = blockMap.get(`${Math.round(x)},${Math.round(y)},${Math.round(z)}`);
    return b && b.userData.solid;
}

function setupInput() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(s => {
        s.addEventListener('touchstart', (e) => {
            e.preventDefault(); e.stopPropagation();
            slots.forEach(el => el.classList.remove('active')); s.classList.add('active');
            currentMat = s.dataset.type;
        });
    });
    
    const zone = document.getElementById('look-zone');
    let lastX = 0, lastY = 0, activeId = null;
    
    zone.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0]; activeId = t.identifier;
        lastX = t.pageX; lastY = t.pageY;
        
        // Start breaking immediately on touch
        startBreak();

    }, {passive:false});
    
    zone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        let t = null; for(let i=0; i<e.changedTouches.length; i++) if(e.changedTouches[i].identifier === activeId) t = e.changedTouches[i];
        if(!t) return;
        
        const dx = t.pageX - lastX; const dy = t.pageY - lastY;
        
        // If moved significantly, cancel breaking
        if(Math.abs(dx)>5 || Math.abs(dy)>5) { 
            isHolding = false;
            breakTarget = null;
            breakMesh.visible = false;
        }
        
        player.rotation.y -= dx * 0.005; head.rotation.x -= dy * 0.005;
        head.rotation.x = Math.max(-1.5, Math.min(1.5, head.rotation.x));
        lastX = t.pageX; lastY = t.pageY;
    }, {passive:false});

    zone.addEventListener('touchend', (e) => {
        // If we release before it broke, it counts as a PLACE attempt
        if(isHolding && breakTarget) {
            // It didn't break yet, so we cancel break
            isHolding = false;
            breakTarget = null;
            breakMesh.visible = false;

            // Only Place if the tap was short
            if (Date.now() - breakStartTime < 300 && currentMat !== 'hand') {
                doPlace();
            }
        }
        activeId = null;
    });

    document.getElementById('btn-jump').addEventListener('touchstart', (e) => {
        e.preventDefault(); if(onGround || isInWater) velocity.y = 0.22;
    });

    const joy = nipplejs.create({ zone: document.getElementById('joystick-zone'), mode: 'static', position: {left: '50%', top: '50%'}, color: 'white' });
    joy.on('move', (evt, data) => { moveFwd = data.vector.y; moveSide = data.vector.x; });
    joy.on('end', () => { moveFwd = 0; moveSide = 0; });
}

function doPlace() {
    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
    const hits = raycaster.intersectObjects(objects);
    if (hits.length > 0 && hits[0].distance < 6) {
        const hit = hits[0];
        const p = hit.point.add(hit.face.normal.multiplyScalar(0.5));
        const bx = Math.round(p.x), by = Math.round(p.y), bz = Math.round(p.z);
        if (Math.abs(bx - player.position.x) > 0.8 || Math.abs(by - player.position.y) > 1.8 || Math.abs(bz - player.position.z) > 0.8) {
            createBlock(bx, by, bz, currentMat);
        }
    }
}
