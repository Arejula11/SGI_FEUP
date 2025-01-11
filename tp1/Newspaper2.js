import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class Newspaper2 {
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
        // Pontos de controle para uma superfície curva em forma de meia-cana
        const controlPoints = [
            [ // U = 0 (lado esquerdo)
                [-1.5, 0, 0, 1],  // V = 0 (inferior esquerdo)
                [-1.5, 0.5, 0.5, 1],  // V = 1
                [-1.5, 1, 1, 1]   // V = 2 (superior esquerdo)
            ],
            [ // U = 1 (meio)
                [0, 0, 0, 1],     // V = 0 (inferior meio)
                [0, 0.5, 1, 1],   // V = 1
                [0, 1, 2, 1]      // V = 2 (superior meio)
            ],
            [ // U = 2 (lado direito)
                [1.5, 0, 0, 1],   // V = 0 (inferior direito)
                [1.5, 0.5, 0.5, 1],  // V = 1
                [1.5, 1, 1, 1]    // V = 2 (superior direito)
            ]
        ];

        // Parâmetros da superfície
        const degreeU = 2;  // Grau da curva em U
        const degreeV = 2;  // Grau da curva em V
        const samplesU = 16; // Número de amostras em U (para suavidade)
        const samplesV = 16; // Número de amostras em V (para suavidade)

        // Criar a geometria NURBS usando MyNurbsBuilder
        const geometry = this.builder.build(controlPoints, degreeU, degreeV, samplesU, samplesV, this.material);

        // Criar a malha e adicionar à cena
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(2.3, 1.18, -1); 
        mesh.rotation.x = -Math.PI -Math.PI/ 4;
        mesh.rotation.y = Math.PI;
        mesh.scale.set(0.25, 0.25, 0.25);
        scene.add(mesh);
    }
}

export default Newspaper2;
