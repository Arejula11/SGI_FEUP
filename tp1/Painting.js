import * as THREE from 'three';

class Painting {

    /**
     * constructs the object
     * @param {number} x The x position of the painting
     * @param {number} y The y position of the painting
     * @param {number} z The z position of the painting
     * @param {number} width The width of the window
     * @param {number} height The height of the window
     * @param {THREE.Material} material The material of the painting
     * @param {number} rotationX The rotation of the window in the x axis
     * @param {number} rotationY The rotation of the window in the y axis
     * @param {number} rotationZ The rotation of the window in the z axis
     */
    constructor(x, y, z, width, height, material, rotationX, rotationY, rotationZ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.material = material
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.rotationZ = rotationZ

    }

        draw(scene) {
        // Create the window
        const geometry = new THREE.PlaneGeometry( this.width, this.height );
        const plane = new THREE.Mesh( geometry, this.material );
        
        //Set the position 
        plane.position.y = this.y;
        plane.position.x = this.x;
        plane.position.z = this.z;

        //Set the rotation
        plane.rotation.x = this.rotationX;
        plane.rotation.y = this.rotationY;
        plane.rotation.z = this.rotationZ;
        scene.add( plane );
    }


}

export default Painting;