import * as THREE from 'three';


class Mat {

    /**
     *  
     * @param {number} x The x position of the mat
     * @param {number} y The y position of the mat
     * @param {number} width The width of the mat
     * @param {number} height The height of the mat
     * @param {number} rotationX The rotation of the mat in the x axis
     * @param {number} rotationY The rotation of the mat in the y axis
     * @param {THREE.Material} planeMaterial The material of the mat
     */
    constructor(x, y, width, height, rotationX, rotationY, planeMaterial) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.material = planeMaterial;
    }

    draw(scene){
        const geometry = new THREE.PlaneGeometry( this.width, this.height );
        const plane = new THREE.Mesh( geometry, this.material );
        plane.receiveShadow = true;
        plane.castShadow = true;
        //Set the position 
        plane.position.y = this.y;
        plane.position.x = this.x;

        //Set the rotation
        plane.rotation.x = this.rotationX;
        plane.rotation.y = this.rotationY;

        scene.add( plane );
    }
}

export default Mat;