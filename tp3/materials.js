import * as THREE from 'three';
import Textures from './textures.js';

class Materials {
    /**
     * Constructor
     * @param {Object} materialData - Material data from JSON
     * @param {Textures} textureManager - Texture manager
     */
    constructor(materialData, textureManager) {
        this.materialData = materialData; 
        this.textureManager = textureManager;
        this.materials = {}; 
    }

    /**
     * Setup materials
     * @returns {Object} The materials
     */
    setup() {
        for (let key in this.materialData) {
            const matInfo = this.materialData[key];
            if(matInfo.twosided){
                matInfo.twosided = THREE.DoubleSide;
            }else{
                matInfo.twosided = THREE.FrontSide;
            }


            const materialOptions = {
                color: new THREE.Color(matInfo.color.r, matInfo.color.g, matInfo.color.b),
                emissive: new THREE.Color(matInfo.emissive.r, matInfo.emissive.g, matInfo.emissive.b),
                shininess: matInfo.shininess || 30,
                transparent: matInfo.transparent || false,
                opacity: matInfo.opacity || 1,
                wireframe: matInfo.wireframe || false,
                side: matInfo.twosided
                
            };


            if (matInfo.textureref) {
                const texture = this.textureManager.getTexture(matInfo.textureref);
                if (texture) {
                    materialOptions.map = texture;
                }
            }

            if (matInfo.bumpref) {
                const bumpMap = this.textureManager.getTexture(matInfo.bumpref);
                if (bumpMap) {
                    materialOptions.bumpMap = bumpMap;
                    materialOptions.bumpScale = matInfo.bumpscale || 1;
                }
            }

            if (matInfo.specularref) {
                const specularMap = this.textureManager.getTexture(matInfo.specularref);
                if (specularMap) {
                    materialOptions.specularMap = specularMap;
                }
            }


            const material = new THREE.MeshPhongMaterial(materialOptions);


            this.materials[key] = material;
        }

        return this.materials; // Retorna os materiais configurados
    }

    /**
     * Returns a material
     * @param {String} materialKey The material key
     * @returns {THREE.Material} The material
     */
    getMaterial(materialKey) {
        // console.log("materialKey ",materialKey, " materials ",this.materials);
        if (this.materials[materialKey.materialId]) {
            return this.materials[materialKey.materialId];
        } else {
            console.warn(`Material "${materialKey}" not found.`);
            return null;
        }
    }
}

export default Materials;
