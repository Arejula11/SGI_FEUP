import * as THREE from 'three';
import Flower from './Flower.js';

class Vase {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {THREE.Material} material 
     */
    constructor(x, y, z, material) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.material = material;
    }

    draw(scene) {
        const points = [];
        points.push(new THREE.Vector2(0.1, 0));    
        points.push(new THREE.Vector2(0.125, 0.1));
        points.push(new THREE.Vector2(0.15, 0.2));
        points.push(new THREE.Vector2(0.125, 0.4));
        points.push(new THREE.Vector2(0.075, 0.6)); 
        points.push(new THREE.Vector2(0.05, 0.75)); 


        const geometry = new THREE.LatheGeometry(points, 32); 
        const vaseMesh = new THREE.Mesh(geometry, this.material);
        vaseMesh.position.set(this.x, this.y, this.z);
        vaseMesh.castShadow = true;
        vaseMesh.receiveShadow = true;
        scene.add(vaseMesh);

       const flower = new Flower(this.x, this.y, this.z, new THREE.MeshStandardMaterial({ color: 0x228B22 }), new THREE.MeshStandardMaterial({ color: 0xffff00 }), new THREE.MeshStandardMaterial({ color: 0xff69b4, side: THREE.DoubleSide }));
        flower.draw(scene);
    }
}

export default Vase;
