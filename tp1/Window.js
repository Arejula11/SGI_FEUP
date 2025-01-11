import * as THREE from 'three';

class Window {

    /**
     * constructs the object
     * @param {number} x The x position of the window
     * @param {number} y The y position of the window
     * @param {number} z The z position of the window
     * @param {number} width The width of the window
     * @param {number} height The height of the window
     * @param {string} color The color of the window
     * @param {number} rotationX The rotation of the window in the x axis
     * @param {number} rotationY The rotation of the window in the y axis
     * @param {number} rotationZ The rotation of the window in the z axis
     */
    constructor(x, y, z, width, height, material, rotationX, rotationY, rotationZ, landscape) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.material = material
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.rotationZ = rotationZ
        this.landscape = landscape

    }

    draw(scene) {

        
        // Create the window
        const geometryTop = new THREE.PlaneGeometry( this.width, this.height/3 );
        const planeTop = new THREE.Mesh( geometryTop, this.material );
        const geometryBottom = new THREE.PlaneGeometry( this.width, this.height/3 );
        const planeBottom = new THREE.Mesh( geometryBottom, this.material );
        const geometryLeft = new THREE.PlaneGeometry( this.width/3, this.height );
        const planeLeft = new THREE.Mesh( geometryLeft, this.material );
        const geometryRight = new THREE.PlaneGeometry( this.width/3, this.height );
        const planeRight = new THREE.Mesh( geometryRight, this.material );
        
        //Set the position 
        planeTop.position.y = this.y+this.height/3;
        planeTop.position.x = this.x;
        planeTop.position.z = this.z;
        
        planeBottom.position.y = this.y-this.height/3;
        planeBottom.position.x = this.x;
        planeBottom.position.z = this.z;

        planeLeft.position.y = this.y;
        planeLeft.position.x = this.x+this.width/3;
        planeLeft.position.z = this.z;

        planeRight.position.y = this.y;
        planeRight.position.x = this.x-this.width/3;
        planeRight.position.z = this.z;


        //Set the rotation
        planeBottom.rotation.x = this.rotationX;
        planeBottom.rotation.y = this.rotationY;
        planeBottom.rotation.z = this.rotationZ;

        planeLeft.rotation.x = this.rotationX;
        planeLeft.rotation.y = this.rotationY;
        planeLeft.rotation.z = this.rotationZ;

        planeRight.rotation.x = this.rotationX;
        planeRight.rotation.y = this.rotationY;
        planeRight.rotation.z = this.rotationZ;

        planeTop.rotation.x = this.rotationX;
        planeTop.rotation.y = this.rotationY;
        planeTop.rotation.z = this.rotationZ;


        scene.add( planeTop );
        scene.add( planeBottom );
        scene.add( planeLeft );
        scene.add( planeRight );


        const geometryLandscape = new THREE.PlaneGeometry( 30, 10 );
        const planeLandscape = new THREE.Mesh( geometryLandscape, this.landscape );
        planeLandscape.position.y = this.y + this.height/2;
        planeLandscape.position.x = this.x;
        planeLandscape.position.z = this.z-5;
        planeLandscape.rotation.x = this.rotationX;
        planeLandscape.rotation.y = this.rotationY;
        planeLandscape.rotation.z = this.rotationZ;
        scene.add( planeLandscape );
    }
}
   

export default Window;