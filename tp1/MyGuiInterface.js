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
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // add a folder to the gui interface for the box
        // const boxFolder = this.datgui.addFolder( 'Box' );
        // // note that we are using a property from the contents object 
        // boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        // boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        // boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        // boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        // boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        // boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
            'spot light color': this.contents.spotLight.color.getHex(),
            'ambient light color': this.contents.ambientLight.color.getHex(),
        };
        // adds a folder to the gui interface for the plane
        // const planeFolder = this.datgui.addFolder( 'Plane' );
        // planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        // planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        // planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        // planeFolder.open();
        const lightFolder = this.datgui.addFolder('Lighting Controls');
        lightFolder.add(this.contents.spotLight, 'intensity', 0, 10).name("Spot Light Intensity");
        lightFolder.add(this.contents.ambientLight, 'intensity', 0, 10).name("Ambient Light Intensity");
        lightFolder.addColor(data, 'spot light color').name("Spot Light Color").onChange((value) => {
            this.contents.spotLight.color.set(value);
        });
        lightFolder.addColor(data, 'ambient light color').name("Ambient Light Color").onChange((value) => {
            this.contents.ambientLight.color.set(value);
        });
        lightFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', ['Initial', 'Perspective', 'Left', 'Top', 'Front', 'Right', 'Back', 'New Perspective', 'Beetle', 'Miguel', 'Bianca', 'Window', 'Corner', 'Table' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', -10, 10).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', -10, 10).name("z coord")
        cameraFolder.open()
    }
}

export { MyGuiInterface };