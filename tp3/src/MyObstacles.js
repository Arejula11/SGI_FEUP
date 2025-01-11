import * as THREE from 'three';

class MyObstacles {
    constructor(material) {
        this.material = material;

    }

    createObstacle(){
        const cloud = new THREE.Group();

        const sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 16),
            this.material
        );
        sphere1.scale.set(10, 10, 10);
        sphere1.position.set(0, 0, 0);
        cloud.add(sphere1);

        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 16),
            this.material
        );
        sphere2.scale.set(10, 10, 10);
        sphere2.position.set(5, 0, 0);
        cloud.add(sphere2);

        const sphere3 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 16),
            this.material
        );
        sphere3.scale.set(10, 10, 10);
        sphere3.position.set(-5, 0, 0);
        cloud.add(sphere3);

        const sphere4 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 16),
            this.material
        );
        sphere4.scale.set(10, 10, 10);
        sphere4.position.set(0, 3, 0);
        cloud.add(sphere4);

        return cloud;
    }


}

export default MyObstacles;