import * as THREE from 'three';
import Cake from './Cake.js';

class Plate {

     constructor(x, y, z, radiusTop, radiusBottom, height, cakeMaterial, cakeInsideMaterial) {
        this.x = x;
        this.y = y;
        this.z = z;
      //   this.color = color;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.cakeMaterial = cakeMaterial;
        this.cakeInsideMaterial = cakeInsideMaterial;
      //   this.radialSegments = radialSegments;
     }

     draw(scene) {

        let plateGeometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments);
        let plateMaterial = new THREE.MeshBasicMaterial({ color: this.color });
        this.plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
        this.plateMesh.receiveShadow = true;
        this.plateMesh.castShadow = true;
        this.plateMesh.position.set(this.x, this.y, this.z);

        scene.add(this.plateMesh);

        //Build the cake
        const cake = new Cake(0.4, 0xfc9d9d, this.x, 1.25+this.height/2, this.z,0.2, 0.06, this.cakeMaterial, this.cakeInsideMaterial);
        cake.draw(scene);
     }

}

export default Plate;