import * as THREE from 'three';

class Shelf {
    /**
     * Cria uma prateleira
     * @param {number} x A posição x da prateleira
     * @param {number} y A posição y da prateleira
     * @param {number} z A posição z da prateleira
     * @param {number} width A largura da prateleira
     * @param {number} height A altura da prateleira
     * @param {number} depth A profundidade da prateleira
     * @param {THREE.Material} material O material da prateleira
     */
    constructor(x, y, z, width, height, depth, material) {
        this.position = new THREE.Vector3(x, y, z);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
    }

    /**
     * @param {THREE.Scene} scene A cena Three.js onde a prateleira será adicionada
     */
    draw(scene) {
         const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const shelfMesh = new THREE.Mesh(geometry, this.material);
        
        shelfMesh.position.copy(this.position);
        shelfMesh.rotation.y = Math.PI / 2;
        scene.add(shelfMesh);
    }
}

export default Shelf;
