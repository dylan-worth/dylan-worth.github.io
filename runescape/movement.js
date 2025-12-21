import * as THREE from 'three';

let targetPosition = new THREE.Vector3();
let isMoving = false;
const MOVE_SPEED = 0.15;
let playerRef, cameraRef, sceneRef;

// Camera State
let camOffset = new THREE.Vector3(0, 15, 12);
let camAngle = 0;
let camZoom = 1.0;

// Input State
let isDragging = false;
let startX = 0, startY = 0;
let lastX = 0;
let lastPinchDist = 0;
let onClickCallback = null; // Function to call when a valid "Tap" happens

// Setup
export function setupMovement(camera, scene, playerGroup, onClick) {
    cameraRef = camera;
    sceneRef = scene;
    playerRef = playerGroup;
    onClickCallback = onClick;

    if(playerRef) targetPosition.copy(playerRef.position);

    const canvas = document.body; // Listen on whole body

    // --- TOUCH EVENTS (Mobile) ---
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    // --- MOUSE EVENTS (Desktop) ---
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', e => e.preventDefault()); // Block right-click menu
}

// --- TOUCH LOGIC ---

function onTouchStart(e) {
    if (e.touches.length === 1) {
        // Single finger: Prepare for Rotate or Tap
        isDragging = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        lastX = startX;
    } else if (e.touches.length === 2) {
        // Two fingers: Prepare for Pinch Zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx*dx + dy*dy);
    }
}

function onTouchMove(e) {
    e.preventDefault(); // Stop scrolling the webpage

    if (e.touches.length === 1) {
        // ROTATE logic
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        const deltaX = x - lastX;
        
        // If moved more than 5 pixels total, treat as a Drag (Rotate), not a Tap
        if (Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5) {
            isDragging = true;
        }

        if (isDragging) {
            camAngle -= deltaX * 0.005; // Rotation Speed
            updateCamOffset();
        }
        lastX = x;
    } 
    else if (e.touches.length === 2) {
        // PINCH ZOOM logic
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const delta = lastPinchDist - dist;
        camZoom += delta * 0.002; // Zoom speed
        camZoom = Math.min(Math.max(camZoom, 0.4), 2.5); // Clamp
        
        updateCamOffset();
        lastPinchDist = dist;
    }
}

function onTouchEnd(e) {
    // If we let go and we HAVEN'T dragged, it's a Click/Tap
    if (!isDragging && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        // Normalize coordinates (-1 to +1)
        const mouse = new THREE.Vector2();
        mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
        
        // Handle Game Click (Walk/Interact)
        if (onClickCallback) onClickCallback(mouse);
        handleWalk(mouse);
    }
    isDragging = false;
}

// --- MOUSE LOGIC (Desktop Fallback) ---

function onMouseDown(e) {
    if (e.button === 2) { // Right Click
        isDragging = true;
        lastX = e.clientX;
    } else if (e.button === 0) { // Left Click
        // Normalize
        const mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        if(onClickCallback) onClickCallback(mouse);
        handleWalk(mouse);
    }
}

function onMouseMove(e) {
    if (isDragging) {
        const deltaX = e.clientX - lastX;
        camAngle -= deltaX * 0.005;
        updateCamOffset();
        lastX = e.clientX;
    }
}

function onMouseUp(e) {
    if (e.button === 2) isDragging = false;
}

function onWheel(e) {
    e.preventDefault();
    camZoom += e.deltaY * 0.001;
    camZoom = Math.min(Math.max(camZoom, 0.4), 2.5);
    updateCamOffset();
}

// --- CORE MOVEMENT ---

function updateCamOffset() {
    const x = Math.sin(camAngle) * 12 * camZoom;
    const z = Math.cos(camAngle) * 12 * camZoom;
    const y = 15 * camZoom;
    camOffset.set(x, y, z);
}

function handleWalk(mouse) {
    // Standard Raycasting for Ground movement
    if (!cameraRef || !sceneRef) return;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(sceneRef.children, true);
    
    for (let hit of intersects) {
        if (hit.object.name === "ground") {
            targetPosition.set(hit.point.x, 0, hit.point.z);
            isMoving = true;
            spawnMarker(hit.point);
            break;
        }
    }
}

export function updateMovement() {
    // 1. Roof Hiding
    if (window.gameState.buildings && playerRef) {
        window.gameState.buildings.forEach(b => {
            const dist = new THREE.Vector3(b.x, 0, b.z).distanceTo(playerRef.position);
            b.roofMesh.visible = (dist > b.radius);
        });
    }

    // 2. Camera Follow
    if (playerRef && cameraRef) {
        const goal = new THREE.Vector3().addVectors(playerRef.position, camOffset);
        cameraRef.position.lerp(goal, 0.1);
        cameraRef.lookAt(playerRef.position);
    }

    // 3. Player Movement
    if (!isMoving || !playerRef) return;

    const dir = new THREE.Vector3().subVectors(targetPosition, playerRef.position);
    if (dir.length() < 0.1) {
        isMoving = false;
        playerRef.position.y = 1.6;
    } else {
        dir.normalize();
        const nextPos = playerRef.position.clone().add(dir.multiplyScalar(MOVE_SPEED));
        
        // Collision
        const pBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(0.5, 1, 0.5));
        let crash = false;
        if (window.gameState.colliders) {
            for (let box of window.gameState.colliders) {
                if (pBox.intersectsBox(box)) { crash = true; isMoving = false; break; }
            }
        }

        if (!crash) {
            playerRef.position.copy(nextPos);
            playerRef.lookAt(targetPosition.x, playerRef.position.y, targetPosition.z);
            playerRef.position.y = 1.6 + Math.abs(Math.sin(Date.now()*0.01)) * 0.1;
        }
    }
}

function spawnMarker(pos) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.2,0.3,8), new THREE.MeshBasicMaterial({color:0xffff00, side:THREE.DoubleSide}));
    m.rotation.x = -Math.PI/2; m.position.copy(pos); m.position.y=0.05;
    sceneRef.add(m);
    setTimeout(()=>sceneRef.remove(m), 500);
}
