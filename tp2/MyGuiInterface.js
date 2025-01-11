import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
 * Set the contents object and update the GUI interface.
 * @param {MyContents} contents - The contents object.
 */
setContents(contents) {
    if (!contents) {
        console.error("Invalid contents provided to MyGuiInterface.");
        return;
    }
    this.contents = contents;
}


    /**
     * Initialize the gui interface
     */
    init() {
        if (!this.contents) {
            console.error("Contents not set. Call setContents() before initializing the GUI.");
            return;
        }
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras || {})).name("Active Camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("x coord");
        cameraFolder.add(this.app.activeCamera.position, 'y', -10, 10).name("y coord");
        cameraFolder.add(this.app.activeCamera.position, 'z', -10, 10).name("z coord");
        cameraFolder.open();

        // Adicionar controle de wireframe
        const materialFolder = this.datgui.addFolder('Materials');
        Object.keys(this.contents.materials.materials).forEach((materialId) => {
            const material = this.contents.materials.materials[materialId];
            materialFolder.add(material, 'wireframe').name(`Wireframe (${materialId})`);
        });
        materialFolder.open();
    }
}

export { MyGuiInterface };