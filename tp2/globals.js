import * as THREE from 'three';

class Globals {
    /**
     * Constructor
     * @param {Object} globalsData - Globals data from JSON
     */
    constructor(globalsData) {

        this.background = globalsData.background || { r: 0, g: 0, b: 0 };
        this.ambient = globalsData.ambient || { r: 1, g: 1, b: 1, intensity: 1 };
        this.fog = globalsData.fog || null;
        this.skybox = globalsData.skybox || null;
    }

    /**
     * Setup globals
     * @param {THREE.Scene} scene - Scene
     */
    draw(scene) {
        if (this.background) {
            const bgColor = this.background;
            scene.background = new THREE.Color(bgColor.r, bgColor.g, bgColor.b);
        }
        if (this.ambient) {
            const ambientLight = new THREE.AmbientLight(
                new THREE.Color(this.ambient.r, this.ambient.g, this.ambient.b),
                this.ambient.intensity
            );
            scene.add(ambientLight);
        }
        if (this.fog) {
            const fogColor = new THREE.Color(this.fog.color.r, this.fog.color.g, this.fog.color.b);
            scene.fog = new THREE.Fog(fogColor, this.fog.near, this.fog.far);
        }
        if (this.skybox) {
            const skyboxTextures = [
                this.skybox.front,
                this.skybox.back,
                this.skybox.up,
                this.skybox.down,
                this.skybox.left,
                this.skybox.right
            ];

            const cubeTextureLoader = new THREE.CubeTextureLoader();
            const skyboxTexture = cubeTextureLoader.load(skyboxTextures);
            scene.background = skyboxTexture;

            if (this.skybox.emissive) {
                const emissiveColor = new THREE.Color(
                    this.skybox.emissive.r,
                    this.skybox.emissive.g,
                    this.skybox.emissive.b
                );
                const intensity = this.skybox.intensity || 1;
                const emissiveLight = new THREE.HemisphereLight(emissiveColor, 0xffffff, intensity);
                scene.add(emissiveLight);
            }
        }
    }
}

export default Globals;
