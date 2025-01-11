import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class Newspaper {
    /**
     * @param {THREE.Texture} texture A textura para a superfície do jornal
     */
    constructor(texture) {
        this.texture = texture;
        this.material = new THREE.MeshLambertMaterial({
            map: this.texture,
            side: THREE.DoubleSide
        });
        this.builder = new MyNurbsBuilder();
    }

    /**
     * Cria a superfície NURBS que representa o jornal dobrado
     * @param {THREE.Scene} scene A cena Three.js onde o jornal será adicionado
     */
    draw(scene) {
       const controlPoints = [
            [ 
                [-1.5, 0, 0, 1],  
                [-1.5, 0.5, 0.5, 1],  
                [-1.5, 1, 1, 1]  
            ],
            [ 
                [0, 0, 0, 1],     
                [0, 0.5, 1, 1],   
                [0, 1, 2, 1]     
            ],
            [ 
                [1.5, 0, 0, 1],  
                [1.5, 0.5, 0.5, 1], 
                [1.5, 1, 1, 1]   
            ]
        ];

        const degreeU = 2;  
        const degreeV = 2;  
        const samplesU = 16; 
        const samplesV = 16; 

        const geometry = this.builder.build(controlPoints, degreeU, degreeV, samplesU, samplesV, this.material);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(2.3, 1.18, -1); 
        mesh.rotation.x = -Math.PI / 1.30;
        mesh.scale.set(0.25, 0.25, 0.25);
        scene.add(mesh);
    }
}

export default Newspaper;
