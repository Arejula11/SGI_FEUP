import * as THREE from 'three';

class Chair {
    /**
     * constructs the object
     * @param {number} width The width of the chair
     * @param {number} height The height of the chair
     * @param {number} length The length of the chair
     * @param {string} material The material of the chair
     * @param {number} x The x position of the chair
     * @param {number} y The y position of the chair
     * @param {number} z The z position of the chair
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
        this.mesh = new THREE.Group(); // Initialize the mesh as a group
    }

    draw(scene) {
        // Create the chair top
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        const top = new THREE.Mesh(geometry, this.materialTop);
        top.receiveShadow = true;
        top.castShadow = true;
        top.position.set(this.x, this.y + this.height / 2, this.z);
        this.mesh.add(top);

        const geometryBack = new THREE.BoxGeometry(this.width, this.height, this.length / 2);
        const back = new THREE.Mesh(geometryBack, this.materialTop);
        back.receiveShadow = true;
        back.castShadow = true;
        back.position.set(this.x, this.y + this.height + 4 * this.height, this.z + this.length / 2 - 0.08);
        back.rotation.x = Math.PI / 2;
        this.mesh.add(back);

        // Create the chair legs
        const legHeight = this.y;
        const legRadius = 0.03;
        const legGeometry1 = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32);
        const legGeometry2 = new THREE.CylinderGeometry(legRadius, legRadius, legHeight * 2, 32);

        // Positions for the four legs
        const legPositions = [
            { x: this.x - this.width / 2 + legRadius, z: this.z - this.length / 2 + legRadius, legGeometry: legGeometry1, y: legHeight /2},
            { x: this.x + this.width / 2 - legRadius, z: this.z - this.length / 2 + legRadius, legGeometry: legGeometry1, y: legHeight /2 },
            { x: this.x - this.width / 2 + legRadius, z: this.z + this.length / 2 - legRadius, legGeometry: legGeometry2, y: legHeight  },
            { x: this.x + this.width / 2 - legRadius, z: this.z + this.length / 2 - legRadius, legGeometry: legGeometry2, y: legHeight  },
        ];

        // Create the four legs
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(pos.legGeometry, this.materialLegs);
            leg.receiveShadow = true;
            leg.castShadow = true;
            leg.position.set(pos.x, pos.y, pos.z);
            this.mesh.add(leg);
        });

        scene.add(this.mesh);
    }

    rotateX(angle) {
        this.mesh.rotateX(angle);
    }

    rotateY(angle) {
        this.mesh.rotateY(angle);
    }

    rotateZ(angle) {
        this.mesh.rotateZ(angle);
    }
}

export default Chair;