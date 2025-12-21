import * as THREE from 'three';

// Export these so other modules can use them
export let scene, camera, renderer;
export let playerGroup;

export function initRenderer() {
    // 1. Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky Blue
    scene.fog = new THREE.Fog(0x87CEEB, 20, 80);  // Distance fog

    // 2. Create Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 12); // High angle view (RuneScape style)
    camera.lookAt(0, 0, 0);

    // 3. Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Turn on shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    
    // Optimize shadow quality
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    
    scene.add(sunLight);

    // 5. Create Player Model (Simple Humanoid)
    playerGroup = new THREE.Group();

    // -- Torso --
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.2, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Platebody Grey
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.6; // Raise off ground
    body.castShadow = true;
    playerGroup.add(body);

    // -- Head --
    const headGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa }); // Skin tone
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;
    head.castShadow = true;
    playerGroup.add(head);

    // -- Legs (One block for simplicity) --
    const legsGeo = new THREE.BoxGeometry(0.7, 1.0, 0.5);
    const legsMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark pants
    const legs = new THREE.Mesh(legsGeo, legsMat);
    legs.position.y = 0.5;
    legs.castShadow = true;
    playerGroup.add(legs);

    // -- Cape (Red) --
    const capeGeo = new THREE.BoxGeometry(0.6, 1.0, 0.1);
    const capeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 1.6, -0.3); // Behind body
    playerGroup.add(cape);

    scene.add(playerGroup);

    // 6. Handle Window Resize
    window.addEventListener('resize', onResize);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
