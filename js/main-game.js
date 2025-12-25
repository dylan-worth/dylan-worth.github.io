import * as THREE from 'three';
import { STATE, CONFIG } from './state.js';
import * as WORLD from './world.js';

// --- SETUP ---
WORLD.initWorld();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const sunLight = new THREE.DirectionalLight(0xffaa00, 1);
sunLight.position.set(50, 50, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
WORLD.scene.add(sunLight);
WORLD.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const player = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.8, 4, 8), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
player.position.set(5, 0.6, 5);
player.castShadow = true;
WORLD.scene.add(player);

// Campfire
const fireGroup = new THREE.Group();
for(let i=0; i<4; i++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2), new THREE.MeshStandardMaterial({color:0x5d4037}));
    log.rotation.z = Math.PI/2; log.rotation.y = (i/4) * Math.PI*2; log.position.y = 0.1; fireGroup.add(log);
}
const fireMesh = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 5), new THREE.MeshBasicMaterial({color: 0xff4400}));
fireMesh.position.y = 0.5; fireGroup.add(fireMesh);
const fireLight = new THREE.PointLight(0xff4400, 0, 15);
fireLight.position.y = 1; fireGroup.add(fireLight);
WORLD.scene.add(fireGroup);

WORLD.createSign({ label: "PROFILE", link: "./profile", desc: "Bio", x: 10, z: 10, color: 0x3498db });
WORLD.createSign({ label: "SOCIALS", link: "./socials", desc: "Posts", x: -10, z: 10, color: 0xe74c3c });
WORLD.createSign({ label: "STREAMING", link: "./disneyplus/home.html", desc: "A curated streaming app for kids", x: -23, z: 9, color: 0xe74c3c });

// --- HELPERS ---
function updateStatsUI() {
    const nextLvl = Math.floor(Math.pow((STATE.level + 1) / CONFIG.maxLevel, 3) * CONFIG.maxXP);
    const currLvl = Math.floor(Math.pow(STATE.level / CONFIG.maxLevel, 3) * CONFIG.maxXP);
    const pct = ((STATE.xp - currLvl) / (nextLvl - currLvl)) * 100;
    
    document.getElementById('xp-fill').style.width = `${Math.max(0, Math.min(100, pct))}%`;
    document.getElementById('level-text').innerText = `LEVEL ${STATE.level}`;
    
    // Inventory
    document.getElementById('wood-count').innerText = STATE.wood;
    document.getElementById('berry-count').innerText = STATE.berries;
    document.getElementById('raw-count').innerText = STATE.rawMeat;
    document.getElementById('cooked-count').innerText = STATE.cookedMeat;
}

function spawnAxeHead(pos) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.1), new THREE.MeshStandardMaterial({color: 0x7f8c8d}));
    head.position.copy(pos).add(new THREE.Vector3(0, 1.5, 0));
    WORLD.scene.add(head);
    const vel = new THREE.Vector3((Math.random()-0.5), 1, (Math.random()-0.5)).multiplyScalar(0.2);
    const interval = setInterval(() => {
        head.position.add(vel); head.rotation.x += 0.2; vel.y -= 0.01;
        if(head.position.y < 0) { clearInterval(interval); WORLD.scene.remove(head); }
    }, 16);
}

// --- GAME LOOP ---

function animate() {
    requestAnimationFrame(animate);

    // 1. Time & Environment
    STATE.time += 0.0001; if(STATE.time > 1) STATE.time = 0;
    const sunInt = Math.max(0, Math.sin(STATE.time * Math.PI));
    const isNight = sunInt < 0.2;
    WORLD.scene.background = new THREE.Color(0x87CEEB).lerp(new THREE.Color(0x050510), 1-sunInt);
    sunLight.intensity = sunInt; 
    sunLight.position.set(Math.cos(STATE.time*Math.PI)*50, Math.sin(STATE.time*Math.PI)*100, 0);
    fireLight.intensity = isNight ? 10+Math.random()*5 : 2;
    fireMesh.visible = true;

    document.getElementById('time-display').innerText = `${Math.floor(STATE.time * 24)}:00`;

    // 2. Movement
    if(Math.abs(stick.x)>0.1 || Math.abs(stick.y)>0.1) {
        player.position.x += stick.x * 0.15; 
        player.position.z += stick.y * 0.15;
        player.rotation.y = Math.atan2(-stick.x, -stick.y);
    }
    camera.position.lerp(player.position.clone().add(new THREE.Vector3(0, STATE.zoom, STATE.zoom-5)), 0.1);
    camera.lookAt(player.position);

    // 3. Rabbit AI
    WORLD.rabbitObjects.forEach(r => {
        r.userData.hopTimer++;
        if(r.userData.hopTimer > 100 + Math.random()*200) {
            const ang = Math.random() * Math.PI*2;
            r.userData.direction.set(Math.cos(ang), 0, Math.sin(ang));
            r.lookAt(r.position.clone().add(r.userData.direction));
            r.userData.hopTimer = 0;
        }
        if(r.userData.hopTimer < 20) {
            r.position.add(r.userData.direction.clone().multiplyScalar(0.05));
            r.position.y = 0.15 + Math.sin((r.userData.hopTimer/20)*Math.PI) * 0.2; 
        } else {
            r.position.y = 0.15;
        }
    });

    // 4. Interaction Checks
    let nearT=null, nearB=null, nearR=null, nearP=null;
    
    WORLD.treeObjects.forEach(t => { 
        if(t.userData.growing) {
            t.userData.scale += 0.02;
            t.scale.setScalar(t.userData.scale);
            if(t.userData.scale >= 1) t.userData.growing = false;
        }
        if(player.position.distanceTo(t.position)<2) nearT=t; 
    });
    WORLD.bushObjects.forEach(b => { 
        if(b.userData.hasBerries && player.position.distanceTo(b.position)<2) nearB=b;
        if(!b.userData.hasBerries) { 
            b.userData.regenTimer++; 
            if(b.userData.regenTimer > 3000) { 
                b.userData.hasBerries = true; 
                b.userData.regenTimer = 0; 
                b.getObjectByName('berries').visible=true; 
            }
        }
    });
    WORLD.rabbitObjects.forEach(r => { if(player.position.distanceTo(r.position)<2.5) nearR=r; });
    WORLD.poiObjects.forEach(p => { if(player.position.distanceTo(p.position)<3) nearP=p; });
    
    STATE.nearbyTree = nearT; STATE.nearbyBush = nearB; STATE.nearbyRabbit = nearR;
    STATE.nearbyFire = player.position.distanceTo(new THREE.Vector3(0,0,0)) < 4;

    // Action Button Logic
    const btn = document.getElementById('action-btn');
    const txt = document.getElementById('action-text');

    if(STATE.axeBroken) {
        btn.classList.add('ready'); btn.style.background='#95a5a6'; txt.innerText='FIX\nAXE';
    } else if(STATE.nearbyFire && STATE.rawMeat > 0) {
        btn.classList.add('ready'); btn.style.background='#d35400'; txt.innerText='COOK\nMEAT';
    } else if(nearR) {
        btn.classList.add('ready'); btn.style.background='#e74c3c'; txt.innerText='ATTACK';
    } else if(nearB) {
        btn.classList.add('ready'); btn.style.background='#e67e22'; txt.innerText='PICK';
    } else if(nearT) {
        btn.classList.add('ready'); btn.style.background='#e74c3c'; txt.innerText='CHOP';
    } else if(STATE.wood>0) {
        btn.classList.add('ready'); btn.style.background='#27ae60'; txt.innerText='PLANT';
    } else {
        btn.classList.remove('ready'); btn.style.background='#e6c86e'; txt.innerText='...';
    }

    // Modal
    const modal = document.getElementById('interaction-modal');
    if(nearP && STATE.nearbyPOI !== nearP) {
        STATE.nearbyPOI = nearP;
        document.getElementById('modal-title').innerText = nearP.userData.label;
        document.getElementById('modal-desc').innerText = nearP.userData.desc;
        document.getElementById('modal-link').href = nearP.userData.link;
        modal.classList.add('active');
    } else if(!nearP) {
        modal.classList.remove('active');
        STATE.nearbyPOI = null;
    }

    renderer.render(WORLD.scene, camera);
}

// --- INPUTS ---
const stick = { x: 0, y: 0 };
const stickEl = document.getElementById('stick');
const zone = document.getElementById('joystick-zone');
function handleInput(cx, cy, end) {
    if(end) { stick.x=0; stick.y=0; stickEl.style.transform=`translate(-50%,-50%)`; return; }
    const rect = zone.getBoundingClientRect();
    let dx = cx-(rect.left+rect.width/2), dy = cy-(rect.top+rect.height/2);
    const dist = Math.sqrt(dx*dx+dy*dy); if(dist>40){dx*=40/dist;dy*=40/dist;}
    stickEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    stick.x = dx/40; stick.y = dy/40;
}
zone.addEventListener('touchmove', e=>{e.preventDefault(); handleInput(e.touches[0].clientX, e.touches[0].clientY)}, {passive:false});
zone.addEventListener('touchend', ()=>handleInput(0,0,true));
let drag=false;
zone.addEventListener('mousedown', e=>{drag=true; handleInput(e.clientX, e.clientY)});
window.addEventListener('mousemove', e=>{if(drag)handleInput(e.clientX, e.clientY)});
window.addEventListener('mouseup', ()=>{drag=false; handleInput(0,0,true)});

document.getElementById('action-btn').addEventListener('click', () => {
    const txt = document.getElementById('action-text').innerText;

    if(STATE.axeBroken) {
        STATE.axeBroken = false;
        document.getElementById('inv-axe').classList.remove('broken');
        return;
    }
    
    if(txt.includes('COOK')) {
        STATE.rawMeat--;
        STATE.cookedMeat++;
        STATE.xp += 15;
        updateStatsUI();
    }
    else if(txt.includes('ATTACK') && STATE.nearbyRabbit) {
        WORLD.scene.remove(STATE.nearbyRabbit);
        const idx = WORLD.rabbitObjects.indexOf(STATE.nearbyRabbit);
        if(idx > -1) WORLD.rabbitObjects.splice(idx, 1);
        STATE.nearbyRabbit = null;
        STATE.rawMeat++;
        STATE.xp += 10;
        updateStatsUI();
    }
    else if(txt === 'PICK' && STATE.nearbyBush) {
        STATE.nearbyBush.userData.hasBerries = false;
        STATE.nearbyBush.getObjectByName('berries').visible = false;
        STATE.berries++;
        STATE.xp += 5;
        updateStatsUI();
    }
    else if(txt === 'CHOP' && STATE.nearbyTree) {
        WORLD.scene.remove(STATE.nearbyTree);
        const idx = WORLD.treeObjects.indexOf(STATE.nearbyTree);
        if(idx > -1) WORLD.treeObjects.splice(idx, 1);
        STATE.nearbyTree = null;
        STATE.wood++;
        STATE.xp += 25;
        if(Math.random() < 0.05) { 
            STATE.axeBroken = true;
            document.getElementById('inv-axe').classList.add('broken');
            spawnAxeHead(player.position);
        }
        updateStatsUI();
    }
    else if(txt === 'PLANT' && STATE.wood > 0) {
        const dir = new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0), player.rotation.y);
        const pos = player.position.clone().add(dir.multiplyScalar(2));
        
        // RANDOM TREE PLANTING
        const rand = Math.random();
        if(rand < 0.6) WORLD.createTree(pos.x, pos.z, 1);
        else if(rand < 0.8) WORLD.createWillow(pos.x, pos.z, 1);
        else WORLD.createMahogany(pos.x, pos.z, 1);
        
        // Set new tree to growing
        WORLD.treeObjects[WORLD.treeObjects.length-1].userData.growing = true;
        WORLD.treeObjects[WORLD.treeObjects.length-1].scale.set(0.1, 0.1, 0.1);
        WORLD.treeObjects[WORLD.treeObjects.length-1].userData.scale = 0.1;

        STATE.wood--;
        updateStatsUI();
    }
});

document.getElementById('zoom-in').onclick = () => STATE.zoom = Math.max(10, STATE.zoom - 5);
document.getElementById('zoom-out').onclick = () => STATE.zoom = Math.min(40, STATE.zoom + 5);

animate();
