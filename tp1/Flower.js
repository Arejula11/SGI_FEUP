import * as THREE from 'three';

class Flower {
    /**
     * @param {number} x A posição x da flor
     * @param {number} y A posição y da flor
     * @param {number} z A posição z da flor
     * @param {THREE.Material} stemMaterial O material do caule
     * @param {THREE.Material} centerMaterial O material do miolo
     * @param {THREE.Material} petalMaterial O material das pétalas
     */
    constructor(x, y, z, stemMaterial, centerMaterial, petalMaterial) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stemMaterial = stemMaterial;
        this.centerMaterial = centerMaterial;
        this.petalMaterial = petalMaterial;
    }

draw(scene) {
    // Criar o caule da flor
    const stemGeometry = new THREE.CylinderGeometry(0.03, 0.015, 1, 16);
    const stemMesh = new THREE.Mesh(stemGeometry, this.stemMaterial);
    stemMesh.position.set(this.x, this.y + 0.5, this.z); // ajuste de posição do caule
    stemMesh.castShadow = true;
    stemMesh.receiveShadow = true;
    scene.add(stemMesh);

    // Criar o miolo da flor
    const centerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const centerMesh = new THREE.Mesh(centerGeometry, this.centerMaterial);
    centerMesh.position.set(this.x, this.y + 1, this.z);
    scene.add(centerMesh);

    // Criar pétalas da flor
    const petalGeometry = new THREE.CircleGeometry(0.1, 16); // reduzir o tamanho das pétalas
    const petalOffsets = [
        { x: 0.1, y: 1, z: 0 },
        { x: -0.1, y: 1, z: 0 },
        { x: 0, y: 1, z: 0.1 },
        { x: 0, y: 1, z: -0.1 },
        { x: 0.07, y: 1, z: 0.07 },
        { x: -0.07, y: 1, z: 0.07 },
        { x: 0.07, y: 1, z: -0.07 },
        { x: -0.07, y: 1, z: -0.07 },
        { x: 0.1, y: 1, z: 0.1 },
        { x: -0.1, y: 1, z: -0.1 }
    ];

    petalOffsets.forEach(offset => {
        const petalMesh = new THREE.Mesh(petalGeometry, this.petalMaterial);
        petalMesh.position.set(this.x + offset.x, this.y + offset.y, this.z + offset.z);
        petalMesh.rotation.x = Math.PI / 2; // Ajuste para deitar as pétalas
        scene.add(petalMesh);
    });
}

}

export default Flower;
