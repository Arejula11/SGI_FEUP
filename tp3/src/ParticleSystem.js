import * as THREE from 'three';

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.initParticles();
    }

    initParticles() {
        const particleCount = 1000; // Número de partículas
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount *10); // Posição (x, y, z)

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 120; // x
            positions[i * 3 + 1] = Math.random() * 120; // y (altura)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 120; // z
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1, // Tamanho das partículas
            transparent: true,
            opacity: 0.8,
        });

        this.particleSystem = new THREE.Points(particles, material);
        this.scene.add(this.particleSystem);

        this.animateParticles();
    }

    animateParticles() {
        const positions = this.particleSystem.geometry.attributes.position.array;

        const update = () => {
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 0.2; // Desce no eixo Y
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 50; // Reinicia no topo
                }
            }

            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(update);
        };

        update();
    }
}

export default ParticleSystem;