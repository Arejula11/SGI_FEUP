import * as THREE from 'three';

class Wall {

    /**
     * constructs the object
     * @param {number} x The x position of the wall
     * @param {number} y The y position of the wall
     * @param {number} z The z position of the wall
     * @param {number} width The width of the wall
     * @param {number} height The height of the wall
     * @param {string} color The color of the wall
     * @param {number} rotationX The rotation of the wall in the x axis
     * @param {number} rotationY The rotation of the wall in the y axis
     * @param {number} rotationZ The rotation of the wall in the z axis
     */
    constructor(x, y, z, width, height, material, rotationX, rotationY, rotationZ, texture) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.material = material
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.rotationZ = rotationZ
        this.texture = texture

    }

    draw(scene) {
        // Create the wall
        const geometry = new THREE.PlaneGeometry( this.width, this.height );
        const plane = new THREE.Mesh( geometry, this.texture );
        plane.receiveShadow = true;
        plane.castShadow = true;
        
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
   

export default Wall;