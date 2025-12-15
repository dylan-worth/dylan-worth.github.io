import { updateSkyUniforms } from './mc-skybox.js';

let sunAngle = 0;

export function updateDayNight(sunLight, sceneFog) {
    sunAngle += 0.0005; // Speed
    const x = Math.sin(sunAngle) * 100;
    const y = Math.cos(sunAngle) * 100;
    sunLight.position.set(x, y, 50);
    
    updateSkyUniforms(sunLight, sceneFog);
}
