

import * as THREE from 'three';


class Spiral {

     constructor(material,x,y,z) {
        this.material = material;
        this.x = x;
        this.y = y;
        this.z = z;
     }

    draw(scene) {
        const spiral = new THREE.Group();
        // Define the parameters of the spiral
        const turns = 15; 
        const height = 5; 
        const radius = 0.5; 
        const points = []; // Array to store the points of the spiral

        const itearations = 100;
        // Define the control points for the spiral
        for (let i = 0; i <= itearations; i++) {
            const y = (height / itearations) * i; 
            const angle = i * 2 * Math.PI * turns / itearations; 
            const x = radius * Math.cos(angle); 
            const z = radius * Math.sin(angle); 
            points.push(new THREE.Vector3(x, y, z));
        }

        // Create the curve
        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(2000); 
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveObject = new THREE.Line(geometry, this.material);
        curveObject.position.set(0, 0, 0);

        // Add to the scene
        spiral.add(curveObject);

        spiral.position.set(this.x, this.y, this.z);
        spiral.rotateX(Math.PI / 2);
        spiral.scale.set(0.08, 0.08, 0.08);

        scene.add(spiral);

    }

}

export default Spiral;