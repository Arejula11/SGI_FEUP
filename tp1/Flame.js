import * as THREE from 'three';

class Flame {
    constructor(x, y, z, radius, height, radialSegments, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.color = color;
    }

    draw(scene) {
        let flameGeometry = new THREE.ConeGeometry(this.radius, this.height, this.radialSegments);
        let flameMaterial = new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide });
        this.flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
        this.flameMesh.receiveShadow = true;
        this.flameMesh.castShadow = true;
        this.flameMesh.position.set(this.x,  this.y, this.z);

        scene.add(this.flameMesh);
    }
}

export default Flame;
