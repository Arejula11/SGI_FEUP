import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import Globals from './globals.js';
import Cameras from './cameras.js';
import Textures from './textures.js';
import Materials from './materials.js';
import Graph from './graphGB.js';

/**
 *  This class contains the contents of our application
 */
class MyContents {
    /**
       Constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;
        this.scene = null;
        this.renderer = null;
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/main/main.json");
    }

    /**
     * Initializes the contents
     */
    init() {}

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.");
        this.onAfterSceneLoadedAndBeforeRender(data);
        

    }

    /**
     * Prints the YASF data
     * @param {Object} data The YASF data
     * @param {String} indent The indentation string
     */
    printYASF(data, indent = '') {
        for (let key in data) {
            const value = data[key];
    
            if (typeof value === 'object' && value !== null) {
                switch (key) {
                    case 'globals':
                        this.processGlobals(value);
                        break;
                    case 'cameras':
                        console.log("Processing cameras...");
                        this.cameras = new Cameras(data[key]);
                        this.cameras.setup(this.renderer);
                        break;
                    case 'textures':
                        console.log("Processing textures...");
                        this.textures = new Textures(data[key]); 
                        this.textures.setup();
                        break;
                    case 'materials':
                        console.log("Processing materials...");
                        this.materials = new Materials(data[key], this.textures); 
                        this.materials.setup();
                        break;
                    case 'graph':
                        this.processGraph(value);
                        break;
                    default:
                        break;
                }
                this.printYASF(value, indent + '\t');
            }
        }
    }

    /**
     * Validates the initialization of the contents
     */
    validateInitialization() {
        if (!this.cameras) {
            console.error("Cameras are not initialized.");
        }
        if (!this.textures) {
            console.error("Textures are not initialized.");
        }
        if (!this.materials) {
            console.error("Materials are not initialized.");
        }
    }
    
    
    /**
     * Processes the globals
     * @param {Object} data The globals data
     */
    processGlobals(data) {
        const globals = new Globals(data);
        globals.draw(this.app.scene);
    }
    
    /**
     * Processes the graph
     * @param {Object} data The graph data
     */
    processGraph(data) {
        if (!this.materials) {
            console.warn("Materials must be processed before the graph.");
            return;
        }
        const graph = new Graph(data, this.materials);
        graph.build(this.app.scene);
    }
    

    /**
     * Called after the scene is loaded and before the rendering starts
     * @param {Object} data The scene data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
    
        this.printYASF(data);
    
    }
    
    /**
     * Updates the contents
     */
    update() {
        if (!this.renderer) {
            console.error("Renderer not initialized.");
            return;
        }
        if (!this.scene) {
            console.error("Scene not initialized.");
            return;
        }
        if (!this.cameras) {
            console.error("Cameras not initialized.");
            return;
        }
    
        const activeCamera = this.cameras.getActiveCamera();
        if (!activeCamera) {
            console.error("No active camera available for rendering.");
            return;
        }
    
        
        this.renderer.render(this.scene, activeCamera);
        requestAnimationFrame(() => this.update());
    }
    
}

export { MyContents };
