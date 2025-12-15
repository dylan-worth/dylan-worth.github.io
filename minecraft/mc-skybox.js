let skyUniforms;

export function createSky(player) {
    const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;
    const fragmentShader = `
        uniform vec3 topColor; uniform vec3 bottomColor;
        uniform float offset; uniform float exponent; uniform vec3 sunPosition;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize( vWorldPosition + offset ).y;
            vec3 sky = mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) );
            vec3 sunDir = normalize(sunPosition);
            float sun = max(dot(sunDir, normalize(vWorldPosition)), 0.0);
            vec3 sunColor = vec3(1.0, 0.9, 0.7) * pow(sun, 50.0);
            gl_FragColor = vec4( sky + sunColor, 1.0 );
        }
    `;

    skyUniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xcce0ff) },
        offset: { value: 33 }, exponent: { value: 0.6 },
        sunPosition: { value: new THREE.Vector3(0, 1, 0) }
    };
    
    const skyGeo = new THREE.SphereGeometry(70, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: skyUniforms, side: THREE.BackSide
    });
    player.add(new THREE.Mesh(skyGeo, skyMat));
}

export function updateSkyUniforms(sunLight, sceneFog) {
    if (!skyUniforms) return;
    skyUniforms.sunPosition.value.copy(sunLight.position);
    
    // Day/Night Colors
    const y = sunLight.position.y;
    if (y > 20) {
        skyUniforms.topColor.value.setHex(0x0077ff);
        skyUniforms.bottomColor.value.setHex(0xcce0ff);
        sceneFog.color.setHex(0xcce0ff);
    } else if (y > -20) {
        skyUniforms.topColor.value.setHex(0xffaa00);
        skyUniforms.bottomColor.value.setHex(0xff5500);
        sceneFog.color.setHex(0xff9900);
    } else {
        skyUniforms.topColor.value.setHex(0x000000);
        skyUniforms.bottomColor.value.setHex(0x000022);
        sceneFog.color.setHex(0x000022);
    }
}
