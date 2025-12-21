export function initMinimap() {
    // No setup needed, HTML canvas handles it
}

export function updateMinimap(scene, player) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas || !player) return;
    
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const range = 40; // How far the minimap sees (world units)
    const scale = center / range;

    // 1. Clear Background
    ctx.fillStyle = '#000000'; // Black background
    ctx.fillRect(0, 0, size, size);
    
    // 2. Clip Circle (Optional, makes it look like a radar)
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.clip();

    // 3. Draw Objects
    scene.children.forEach(obj => {
        if (!obj.visible) return;

        // Calculate relative position
        const dx = obj.position.x - player.position.x;
        const dz = obj.position.z - player.position.z;

        // Skip if too far
        if (Math.abs(dx) > range || Math.abs(dz) > range) return;

        // Map to Canvas Coords (Rotate -90 deg because Canvas Y is Down)
        // Actually, just direct mapping works if camera is aligned
        const mapX = center + dx * scale;
        const mapY = center + dz * scale;

        // Determine Type
        let color = null;
        let radius = 2;

        if (obj.userData) {
            if (obj.userData.type === 'tree') { color = '#00ff00'; } // Green Tree
            else if (obj.userData.type === 'npc') { color = '#ffff00'; radius = 3; } // Yellow Dot
            else if (obj.userData.type === 'bank_booth') { color = '#00ffff'; radius = 3; } // Cyan Bank
            else if (obj.userData.type === 'chess_table') { color = '#ffffff'; } // White
        }
        
        // Draw Walls (Buildings)
        // Walls are usually standard Meshes without userData groups, check geometry
        if (!color && obj.geometry && obj.geometry.type === 'BoxGeometry') {
             // Simple check for walls (grey boxes)
             if(obj.material && obj.material.color && obj.material.color.getHex() === 0x888888) {
                 color = '#888888';
             }
        }

        if (color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(mapX, mapY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 4. Draw Player (Center Red Dot)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Draw Border
    ctx.strokeStyle = '#dba159'; // OSRS Gold Border
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(center, center, center-2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}
