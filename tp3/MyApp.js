
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor(display) {
        this.scene = null
        this.stats = null
        this.display = display

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(0,70,250)
        this.cameras['Perspective'] = perspective1

    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

     /**
     * sets the active camera by object
     * @param {THREE.Camera} camera
     */
     followObject(object) {
        this.balloon = this.scene.getObjectByName(object);
    
        const cameraOffset = new THREE.Vector3(0, 0, -0.5); // Offset from the object
    
        const animate = () => {
            requestAnimationFrame(animate);
    
            // Calcular la posición deseada de la cámara en el espacio local del objeto
            const cameraPosition = cameraOffset.clone().applyQuaternion(this.balloon.quaternion);
    
            // Mover la cámara a la posición calculada
            this.activeCamera.position.copy(this.balloon.position.clone().add(cameraPosition));
    
            // Hacer que la cámara apunte al objeto
            this.activeCamera.lookAt(this.balloon.position);
    
            // Renderizar la escena
            this.renderer.render(this.scene, this.activeCamera);
        };
    
        animate();
    }

    /**
     * sets the active camera by object
     * @param {THREE.Camera} camera
     */
    followObjectThreePerson(object) {
        this.balloon = this.scene.getObjectByName(object);
    
        const cameraOffset = new THREE.Vector3(0, 5, -20); // Offset from the object
    
        const animate = () => {
            requestAnimationFrame(animate);
    
            // Calcular la posición deseada de la cámara en el espacio local del objeto
            const cameraPosition = cameraOffset.clone().applyQuaternion(this.balloon.quaternion);
    
            // Mover la cámara a la posición calculada
            this.activeCamera.position.copy(this.balloon.position.clone().add(cameraPosition));
    
            // Hacer que la cámara apunte al objeto
            this.activeCamera.lookAt(this.balloon.position);
    
            // Renderizar la escena
            this.renderer.render(this.scene, this.activeCamera);
        };
    
        animate();
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    
    /**
     * Sets the contents object and updates the cameras.
     * @param {MyContents} contents 
     */
    setContents(contents) {
        if (contents) {
            this.contents = contents;
            if (this.contents.cameras.cameras) {
                const camerasObject = this.contents.cameras.cameras; 
                this.cameras = camerasObject;
                const defaultCameraName = this.contents.cameras.camerasData.initial;
                if (defaultCameraName) {
                    this.setActiveCamera(defaultCameraName);
                } else {
                    console.warn("No cameras found in contents to set as active.");
                }
            } else {
                console.warn("No valid cameras found in contents.app.cameras.");
            }
        } else {
            console.error("Invalid contents provided.");
        }
    }
    

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };