import * as THREE from 'three';


class Floor {

    /**
     *  
     * @param {number} x The x position of the floor
     * @param {number} y The y position of the floor
     * @param {number} width The width of the floor
     * @param {number} height The height of the floor
     * @param {number} rotationX The rotation of the floor in the x axis
     * @param {number} rotationY The rotation of the floor in the y axis
     * @param {THREE.Material} planeMaterial The material of the floor
     */
    constructor(x, y, width, height, rotationX, rotationY, planeMaterial) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.planeMaterial = planeMaterial;
    }

    draw(scene){
        //Create the floor
        let plane = new THREE.PlaneGeometry( this.width, this.height );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.receiveShadow = true;
        this.planeMesh.castShadow = true;
        this.planeMesh.rotation.x = this.rotationX;
        this.planeMesh.position.y = this.rotationY;
        scene.add( this.planeMesh );
    }
}

export default Floor;