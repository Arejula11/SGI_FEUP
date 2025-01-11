import * as THREE from 'three';

class Jar {
    /**
     * Cria o jarro
     * @param {number} x A posição x do jarro
     * @param {number} y A posição y do jarro
     * @param {number} z A posição z do jarro
     * @param {THREE.Material} material O material do jarro
     */
    constructor(x, y, z, material) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.material = material;
    }

    draw(scene) {
        const points = [];
        points.push(new THREE.Vector2(0.4, 0)); 
        points.push(new THREE.Vector2(0.5, 0.2));
        points.push(new THREE.Vector2(0.6, 1.0)); 

        const geometry = new THREE.LatheGeometry(points, 32); 
        const jarMesh = new THREE.Mesh(geometry, this.material);
        jarMesh.castShadow = true;
        jarMesh.receiveShadow = true
        jarMesh.position.set(this.x, this.y, this.z);

        scene.add(jarMesh);
    }
}

export default Jar;