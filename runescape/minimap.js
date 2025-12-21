export function updateMinimap(scene, player) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas || !player) return;
    
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const range = 50; // Zoom level
    const scale = center / range;

    // 1. Clear & Background
    ctx.fillStyle = '#111'; 
    ctx.fillRect(0, 0, size, size);
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.clip();

    // 2. Draw Terrain (Ground, Water, Paths) first
    scene.children.forEach(obj => {
        if (!obj.visible) return;
        
        // Calculate relative position (Top-down view)
        const dx = (obj.position.x - player.position.x) * scale;
        const dy = (obj.position.z - player.position.z) * scale;
        
        let color = null;
        let w = 0, h = 0;

        // Detect Terrain Types based on Name
        if (obj.name === 'water_terrain') { color = '#0066ff'; }
        else if (obj.name === 'path_terrain') { color = '#8b5a2b'; }
        else if (obj.name === 'ground_terrain') { color = '#2d5a27'; }

        if (color && obj.geometry && obj.geometry.parameters) {
            // Draw Rectangle for terrain chunks
            ctx.fillStyle = color;
            
            // Get dimensions from geometry
            // Note: Planes are usually Width/Height. Boxes are Width/Height/Depth.
            let geoW = obj.geometry.parameters.width || 1;
            let geoH = obj.geometry.parameters.height || obj.geometry.parameters.depth || 1;
            
            // Apply rotation logic roughly
            if (Math.abs(obj.rotation.z) > 1) { [geoW, geoH] = [geoH, geoW]; }

            ctx.fillRect(center + dx - (geoW*scale/2), center + dy - (geoH*scale/2), geoW*scale, geoH*scale);
        }
    });

    // 3. Draw Objects (Trees, NPCs, Walls) on top
    scene.children.forEach(obj => {
        if (!obj.userData || !obj.visible) return;
        
        const dx = (obj.position.x - player.position.x) * scale;
        const dy = (obj.position.z - player.position.z) * scale;

        let color = null;
        let radius = 2;

        if (obj.userData.type === 'tree') color = '#00ff00';
        if (obj.userData.type === 'npc') { color = '#ffff00'; radius = 3; }
        if (obj.userData.type === 'snow_pile') { color = '#ffffff'; radius = 3; }
        if (obj.userData.type === 'bank_booth') { color = 'cyan'; radius = 3; }
        
        if (color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(center + dx, center + dy, radius, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // 4. Player
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Border
    ctx.strokeStyle = '#dba159';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, center-2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}
