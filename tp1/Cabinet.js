import * as THREE from 'three';

class Cabinet {
    /**
     * @param {number} width A largura do armário
     * @param {number} height A altura do armário
     * @param {number} depth A profundidade do armário
     * @param {THREE.Material} material O material do corpo do armário
     * @param {THREE.Material} doorMaterial O material das portas do armário
     * @param {number} x A posição x do armário
     * @param {number} y A posição y do armário
     * @param {number} z A posição z do armário
     */
    constructor(width, height, depth, material, doorMaterial, x, y, z) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.doorMaterial = doorMaterial;
        this.position = new THREE.Vector3(x, y, z);
    }

    draw(scene) {
        // Corpo do armário
        const bodyGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const bodyMesh = new THREE.Mesh(bodyGeometry, this.material);
        bodyMesh.position.set(this.position.x, this.position.y + this.height / 2, this.position.z); 
        scene.add(bodyMesh);

        // Portas
        const doorWidth = this.width / 2;
        const doorHeight = this.height;

        // Porta esquerda
        const leftDoorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, this.depth / 20);
        const leftDoorMesh = new THREE.Mesh(leftDoorGeometry, this.doorMaterial);
        leftDoorMesh.position.set(this.position.x - doorWidth / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2 + 0.01); 
        leftDoorMesh.rotation.y = Math.PI / 180 * 5;
        scene.add(leftDoorMesh);

        // Porta direita
        const rightDoorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, this.depth / 20);
        const rightDoorMesh = new THREE.Mesh(rightDoorGeometry, this.doorMaterial);
        rightDoorMesh.position.set(this.position.x + doorWidth / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2 + 0.01);
        rightDoorMesh.rotation.y = -Math.PI / 180 * 5;
        scene.add(rightDoorMesh);

        // Prateleiras
        const shelfCount = 3;
        for (let i = 1; i <= shelfCount; i++) {
            const shelfGeometry = new THREE.BoxGeometry(this.width - 0.1, this.depth / 10, this.depth - 0.1);
            const shelfMesh = new THREE.Mesh(shelfGeometry, this.material);
            shelfMesh.position.set(this.position.x, this.position.y + (i * this.height) / (shelfCount + 1), this.position.z);
            scene.add(shelfMesh);
        }
    }
}

export default Cabinet;
