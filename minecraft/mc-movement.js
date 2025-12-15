import { WORLD_RADIUS } from './mc-world.js';

const MOVE_SPEED = 0.14;
const GRAVITY = 0.012;
const JUMP_FORCE = 0.22;

export function updatePhysics(player, velocity, input, blockMap, state) {
    const { fwd, side, isJumping } = input;
    const { onGround, isInWater, inWhirlpool } = state;

    // 1. Apply Gravity / Buoyancy
    if (!inWhirlpool) {
        if (isInWater) {
            velocity.y -= 0.002; // Float
            velocity.y *= 0.9;   // Water drag
        } else {
            velocity.y -= GRAVITY; // Normal gravity
        }
    }

    // 2. Handle Jump / Swim Up
    if (isJumping) {
        if (onGround || isInWater) {
            velocity.y = JUMP_FORCE;
        }
    }

    // 3. Calculate Movement Direction (FIXED)
    const yaw = player.rotation.y;
    
    // Forward Vector (Three.js standard is -Z for forward)
    const fwdX = -Math.sin(yaw);
    const fwdZ = -Math.cos(yaw);

    // Right Vector (90 degrees relative to forward)
    // FIX: Removed the negative sign from Cos and added it to Sin to swap direction
    const rightX = Math.cos(yaw); 
    const rightZ = -Math.sin(yaw);

    // Combine inputs
    const moveX = (fwdX * fwd) + (rightX * side);
    const moveZ = (fwdZ * fwd) + (rightZ * side);

    // Normalize speed
    const dx = moveX * MOVE_SPEED;
    const dz = moveZ * MOVE_SPEED;

    // 4. Apply X Movement (with Collision)
    if (!checkColl(player.position.x + dx, player.position.y, player.position.z, blockMap) && 
        !checkColl(player.position.x + dx, player.position.y - 1, player.position.z, blockMap)) {
        player.position.x += dx;
    }

    // 5. Apply Z Movement (with Collision)
    if (!checkColl(player.position.x, player.position.y, player.position.z + dz, blockMap) && 
        !checkColl(player.position.x, player.position.y - 1, player.position.z + dz, blockMap)) {
        player.position.z += dz;
    }

    // 6. Apply Y Movement (Falling/Jumping)
    let nextY = player.position.y + velocity.y;
    
    // Check floor collision (Feet)
    if (velocity.y < 0 && checkColl(player.position.x, nextY - 1.5, player.position.z, blockMap)) {
        velocity.y = 0;
        state.onGround = true;
        // Snap to top of block
        player.position.y = Math.round(nextY - 1.5) + 1.5 + 0.001;
    } else {
        player.position.y = nextY;
        state.onGround = false;
    }

    // 7. World Boundary (Respawn if fallen)
    if (player.position.y < -15) player.position.set(0, 20, 0);

    return state;
}

// Helper: Check if a block exists at x,y,z
function checkColl(x, y, z, blockMap) {
    const key = `${Math.round(x)},${Math.round(y)},${Math.round(z)}`;
    const b = blockMap.get(key);
    // Only collide if block exists AND is marked solid
    return b && b.userData.solid;
}
