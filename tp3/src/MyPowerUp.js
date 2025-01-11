import * as THREE from 'three';

class MyPowerUp {
    constructor(material) {
        this.material = material;
    }

    createPowerUp() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        // Shaders
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float time;
            varying vec2 vUv;

            void main() {
                float pulse = abs(sin(time * 2.0)) * 0.5 + 0.5;
                gl_FragColor = vec4(vec3(pulse), 1.0);
            }
        `;

        // Shader Material
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0.0 },
            },
        });

        const powerUp = new THREE.Mesh(geometry, shaderMaterial);

        // Update animation in the render loop
        powerUp.onBeforeRender = (renderer, scene, camera) => {
            shaderMaterial.uniforms.time.value += 0.01;
        };

        return powerUp;
    }
}

export default MyPowerUp;
