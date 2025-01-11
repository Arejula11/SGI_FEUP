import * as THREE from 'three';

class Table {
    /**
     * constructs the object
     * @param {number} width The width of the table
     * @param {number} height The height of the table
     * @param {number} length The length of the table
     * @param {material} materialTop The materialTop of the table
     * @param {material} materialLegs The materialLegs of the table
     * @param {number} x The x position of the table
     * @param {number} y The y position of the table
     * @param {number} z The z position of the table
     */
    constructor(width, height, length, materialTop, materialLegs, x, y, z) {
        this.width = width;
        this.height = height;
        this.length = length;
        this.materialTop = materialTop;
        this.materialLegs = materialLegs;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    draw(scene) {
        // Create the table top
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        // const material = new THREE.MeshBasicMaterial( {color: this.color, side: THREE.planeMaterial} );
        const top = new THREE.Mesh(geometry, this.materialTop);
        top.receiveShadow = true;
        top.castShadow = true;
        top.position.set(this.x, this.y + this.height / 2, this.z);
        scene.add(top);

        // Create the table legs
        const legHeight = this.y; 
        const legRadius = 0.1; 
        const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32);
        // const legMaterial = new THREE.MeshBasicMaterial({ color: this.color });

        // Positions for the four legs
        const legPositions = [
            { x: this.x - this.width / 2 + legRadius, z: this.z - this.length / 2 + legRadius },
            { x: this.x + this.width / 2 - legRadius, z: this.z - this.length / 2 + legRadius },
            { x: this.x - this.width / 2 + legRadius, z: this.z + this.length / 2 - legRadius },
            { x: this.x + this.width / 2 - legRadius, z: this.z + this.length / 2 - legRadius }
        ];

        // Create the four legs
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, this.materialLegs);
            leg.receiveShadow = true;
            leg.castShadow = true;
            leg.position.set(pos.x, legHeight / 2, pos.z);
            scene.add(leg);
        });
    }
}

export default Table;