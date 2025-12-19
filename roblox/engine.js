// PASTE THIS INTO A NEW NODE SCRIPT TO TEST SKELETONS
// _ready
const bones = [];
const rootBone = new THREE.Bone(); rootBone.name = "Root";
const headBone = new THREE.Bone(); headBone.name = "Head";
rootBone.add(headBone); headBone.position.y = 2;
bones.push(rootBone, headBone);
const skeleton = new THREE.Skeleton(bones);

// Visual Helper
const helper = new THREE.SkeletonHelper(rootBone);
Game.scene.add(helper);
this.sceneObj = rootBone; // Hack to make engine see it
this.sceneObj.skeleton = skeleton;
