import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.troughMesh = null;
        this.buildEnvironment();
        this.buildFence();
        this.buildTrough();
    }

    buildEnvironment() {
        // Large grass plane
        const planeGeo = new THREE.PlaneGeometry(100, 100);
        const planeMat = new THREE.MeshStandardMaterial({ color: 0x67b854 });
        const ground = new THREE.Mesh(planeGeo, planeMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    buildFence() {
        const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 }); // Brown wood
        const fenceHeight = 0.8;
        const penSize = 10; // 10x10 area

        // Helper to create a single fence post/rail
        const createPost = (x, z) => {
            const postGeo = new THREE.BoxGeometry(0.3, fenceHeight, 0.3);
            const post = new THREE.Mesh(postGeo, fenceMaterial);
            post.position.set(x, fenceHeight / 2, z);
            post.castShadow = true;
            this.scene.add(post);
        };

        // Create 4 corners and rails
        for (let i = -5; i <= 5; i += 2.5) {
            createPost(i, 5);  // North wall
            createPost(i, -5); // South wall
            createPost(5, i);  // East wall
            createPost(-5, i); // West wall
        }
    }

    buildTrough() {
        const group = new THREE.Group();
        
        // The container
        const baseGeo = new THREE.BoxGeometry(2, 0.5, 1);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        // The "Food" inside
        const foodGeo = new THREE.BoxGeometry(1.8, 0.2, 0.8);
        const foodMat = new THREE.MeshStandardMaterial({ color: 0xffd54f }); // Yellow hay color
        this.foodMesh = new THREE.Mesh(foodGeo, foodMat);
        this.foodMesh.position.y = 0.25;
        group.add(this.foodMesh);

        group.position.set(0, 0.25, -4); // Place it against the back fence
        this.scene.add(group);
    }

    updateTroughVisual(isFull) {
        if (this.foodMesh) {
            this.foodMesh.visible = isFull;
        }
    }
}
