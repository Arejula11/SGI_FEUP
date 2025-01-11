import * as THREE from 'three';
import Candle from './Candle.js';
class Cake {

    
    /**
     * constructs the object
     * @param {number} radius The radius of the cake
     * @param {string} color The color of the cake
     * @param {number} x The x position of the cake
     * @param {number} y The y position of the cake
     * @param {number} z The z position of the cake
     * @param {number} height The height of the cake
     * @param {number} candleHeight The height of the candle
     * @param {THREE.Material} material The material of the cake
     * @param {THREE.Material} materialInside The material of the inside of the cake
    */
    constructor(radius, color, x, y, z,height, candleHeight, material, materialInside) {
        this.radius = radius;
        this.color = color;
        this.x = x;
        this.y = y;
        this.z = z;
        this.height = height;
        this.thetaStart = 0;
        this.thetaLength = 5.5;
        this.candleHeight = candleHeight;
        this.material = material;
        this.materialInside = materialInside;
    }

    draw(scene){
        // Create the cake
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, this.thetaStart, this.thetaLength); 
        // const material = new THREE.MeshStandardMaterial( {color: this.color, side:THREE.DoubleSide} ); 
        const cylinder = new THREE.Mesh( geometry, this.material ); 
        
        //Set the position
        cylinder.position.x = this.x;
        cylinder.position.y = this.y;
        cylinder.position.z = this.z;
        cylinder.receiveShadow = true;
        cylinder.castShadow = true;

        scene.add( cylinder );

        //Create the sides
        const plane = new THREE.PlaneGeometry( this.radius, this.height, 32 );
        const side1 = new THREE.Mesh( plane, this.materialInside );
        side1.position.x = this.x;
        side1.position.y = this.y;
        side1.position.z = this.z + this.radius/2;
        side1.rotation.y = Math.PI / 2;
        scene.add( side1 );
        
        

        const side2 = new THREE.Mesh( plane, this.materialInside );
        side2.position.x = this.x-0.1758+0.0295+0.00384; //0.17-0.0058
        side2.position.y = this.y;
        side2.position.z = this.z+this.radius/2-0.0858+0.0278+0.00204; //0.08+0.0058
        side2.rotation.y = -(this.thetaLength);

        scene.add( side2 );


        const candle = new Candle(this.x, this.y+this.height/2+this.candleHeight/2, this.z, 0.05, 0.05, this.candleHeight, 16, 0xffffff, 0.08);
        candle.draw(scene);
    }
}

export default Cake;
