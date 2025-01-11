import * as THREE from 'three';
import Flame from './Flame.js'; // Importa a classe Flame para adicionar a chama

class Candle {
    constructor(x, y, z, radiusTop, radiusBottom, height, radialSegments, color, flameHeight) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = radialSegments;
        this.color = color;
        this.flameHeight = flameHeight; 
    }

    draw(scene) {
        let candleGeometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments);
        let candleMaterial = new THREE.MeshBasicMaterial({ color: this.color });
        this.candleMesh = new THREE.Mesh(candleGeometry, candleMaterial);

        this.candleMesh.position.set(this.x, this.y, this.z);
        this.candleMesh.receiveShadow = true;
        this.candleMesh.castShadow = true;

        scene.add(this.candleMesh);
        const flameAtributes = {
            x: this.x,
            y: this.y + this.height / 2 + this.flameHeight / 2,
            z: this.z,
            radius: 0.02,
            height: this.flameHeight,
            radialSegments: 16,
            color: 0xff4500
        }
        const flame = new Flame(flameAtributes.x, flameAtributes.y, flameAtributes.z, flameAtributes.radius, flameAtributes.height, flameAtributes.radialSegments, flameAtributes.color);
        flame.draw(scene);
    }
}

export default Candle;

