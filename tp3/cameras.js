import * as THREE from 'three';

class Cameras {
    /**
     * Constructor
     * @param {Object} camerasData - Cameras data from JSON
     */
    constructor(camerasData) {
        this.camerasData = camerasData; // Armazena os dados das câmeras do JSON
        this.cameras = {}; // Armazena as câmeras criadas
        this.activeCamera = camerasData.initial;
    }

    /**
     * Setup cameras
     * @param {THREE.WebGLRenderer} renderer - Renderer
     */
    setup(renderer) {
        for (let key in this.camerasData) {
            const camData = this.camerasData[key];
            let camera;
            if (camData.type === 'perspective') {
                camera = new THREE.PerspectiveCamera(
                    camData.angle,
                    window.innerWidth / window.innerHeight,
                    camData.near,
                    camData.far
                );
            } else if (camData.type === 'orthogonal') {
                camera = new THREE.OrthographicCamera(
                    camData.left,
                    camData.right,
                    camData.top,
                    camData.bottom,
                    camData.near,
                    camData.far
                );
            } else {
                console.warn(`Unknown camera type: ${camData.type}`);
                continue;
            }

            camera.position.set(camData.location.x, camData.location.y, camData.location.z);
            const target = new THREE.Vector3(camData.target.x, camData.target.y, camData.target.z);
            camera.lookAt(target);

            this.cameras[key] = camera;

            if (key === this.camerasData.initial) {
                this.activeCamera = camera; 
            }
        }

        if (this.activeCamera) {
            renderer.camera = this.activeCamera;
        } else {
            console.warn("No initial camera defined.");
        }
    }

    /**
     * Returns the active camera
     * @returns {THREE.Camera} The active camera
     */
    getActiveCamera() {
        return this.activeCamera;
    }
}

export default Cameras;


