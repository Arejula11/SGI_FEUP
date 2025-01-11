
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
    constructor() {
        this.scene = null
        this.stats = null

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
        this.setActiveCamera('Initial');

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
                THREE.PCFSoftShadowMap; 

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
        const perspective1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        perspective1.position.set(10, 10, 3);
        this.cameras['Perspective'] = perspective1;

        // Create another perspective camera with a different point of view
        const perspective2 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        perspective2.position.set(20, 15, 10);
        perspective2.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['New Perspective'] = perspective2;

        // Create a third perspective camera with a different point of view
        const perspective3 = new THREE.PerspectiveCamera(65, aspect, 0.1, 1000);
        perspective3.position.set(4.7, 3, 3.7);
        perspective3.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Corner'] = perspective3;

        // Create a camera focus on the table
        const tableCamera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
        tableCamera.position.set(2, 5, 0);
        tableCamera.lookAt(new THREE.Vector3(2, 0, 0));
        this.cameras['Table'] = tableCamera;

        // Create a camera looking at the beetle
        const beetleCamera = new THREE.PerspectiveCamera(80, aspect, 0.1, 1000);
        beetleCamera.position.set(-1, 1.5, 0);
        beetleCamera.lookAt(new THREE.Vector3(-5, 1.5, 0));
        this.cameras['Beetle'] = beetleCamera;

        // Create two cameras looking at the pictures
        const pictureMiguel = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
        pictureMiguel.position.set(-1.5, 1.5, 1);
        pictureMiguel.lookAt(new THREE.Vector3(-1.5, 1.5, 3.9));
        this.cameras['Miguel'] = pictureMiguel;

        const pictureBianca = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
        pictureBianca.position.set(1.5, 1.5, 1);
        pictureBianca.lookAt(new THREE.Vector3(1.5, 1.5, 3.9));
        this.cameras['Bianca'] = pictureBianca;

        // Create a inicial camera
        const initialCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
        initialCamera.position.set(0, 20, 0);
        initialCamera.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Initial'] = initialCamera;

        // Crate a camera looking through the window
        const windowCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
        windowCamera.position.set(0, 1.5, 1);
        windowCamera.lookAt(new THREE.Vector3(0, 1.5, -4));
        this.cameras['Window'] = windowCamera;



        // Define the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect;
        const right = this.frustumSize / 2 * aspect;
        const top = this.frustumSize / 2;
        const bottom = -this.frustumSize / 2;
        const near = -this.frustumSize / 2;
        const far = this.frustumSize;

        // Create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0, 1, 0);
        orthoLeft.position.set(-this.frustumSize / 4, 0, 0);
        orthoLeft.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Left'] = orthoLeft;

        // Create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0, 0, 1);
        orthoTop.position.set(0, this.frustumSize / 4, 0);
        orthoTop.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Top'] = orthoTop;

        // Create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        orthoFront.up = new THREE.Vector3(0, 1, 0);
        orthoFront.position.set(0, 0, this.frustumSize / 4);
        orthoFront.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Front'] = orthoFront;

        // Create a right view orthographic camera
        const orthoRight = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0, 1, 0);
        orthoRight.position.set(this.frustumSize / 4, 0, 0);  // Right view position
        orthoRight.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Right'] = orthoRight;

        // Create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        orthoBack.up = new THREE.Vector3(0, 1, 0);
        orthoBack.position.set(0, 0, -this.frustumSize / 4);  // Back view position
        orthoBack.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameras['Back'] = orthoBack;

       
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
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
            if (this.lastCameraName !== this.activeCameraName) {
                this.lastCameraName = this.activeCameraName;
                this.activeCamera = this.cameras[this.activeCameraName];
                document.getElementById("camera").innerHTML = this.activeCameraName;
        
                // Update the camera aspect ratio and renderer size
                this.onResize();
        
                if (this.controls === null) {
                    this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                    this.controls.enableZoom = true;
                } else {
                    this.controls.object = this.activeCamera;
                }
        
                // Set the controls target based on camera type
                switch (this.activeCameraName) {
                    case 'Beetle':
                        this.controls.target.set(-5, 1.5, 0);
                        break;
                    case 'Miguel':
                        this.controls.target.set(-1.5, 1.5, 3.9);
                        break;
                    case 'Bianca':
                        this.controls.target.set(1.5, 1.5, 3.9);
                        break;
                    case 'Window':
                        this.controls.target.set(0, 1.5, -4);
                        break;
                    case 'Table':
                        this.controls.target.set(2, 0, 0);
                        break;
                    default:
                        this.controls.target.set(0, 0, 0);
                        break;
                }
        
                this.controls.update();
        
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
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
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