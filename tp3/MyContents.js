import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import MyTrack from './src/MyTrack.js';
import { MyFileReader } from './parser/MyFileReader.js';
import Globals from './globals.js';
import Cameras from './cameras.js';
import Textures from './textures.js';
import Materials from './materials.js';
import Graph from './graph.js';
import PickingManager from './pickingManager.js'; 
import TextManager from './textManager.js';
import MyRoutes  from './src/MyRoutes.js';
import {MyNurbsBuilder} from './src/MyNurbsBuilder.js';
import ParticleSystem from './src/ParticleSystem.js';

class MyContents {
    constructor(app, path) {
        this.path = path
        this.app = app;
        this.axis = null;
        this.scene = null;
        this.renderer = null;
        this.interactiveObjects = []; 
        this.pickingManager = null; 
        this.textManager = null;
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open(path);
        this.graph = null;

        this.selectedBalloon = 'null'; 
        this.spaceNameClicked = false; 
    }

    onSceneLoaded(data) {
        console.info("YASF loaded.");
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

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

    processGlobals(data) {
        
        const globals = new Globals(data);
        globals.draw(this.app.scene);
    }

    processGraph(data) {
        if (!this.materials) {
            console.warn("Materials must be processed before the graph.");
            return;
        }        
        if (this.path == "scenes/main/scene_game.json" ) {
            this.graph = new Graph(data, this.materials);
            this.graph.build(this.app.scene);
        } else if (this.path == "scenes/main/scene_initial.json" ){
            const graph = new Graph(data, this.materials);
            graph.build(this.app.scene);

            this.textManager.addTextToScene("FEUP Skylines", 0, 120, 90, 10);
            this.textManager.addTextToScene("write your start position", 0, 60, 91, 3.5,"placeholderText")
            this.textManager.addTextToScene("Authors: Bianca Oliveira, Miguel Arejula", 0, 22, 90, 4); 
            this.addInteractiveObjects();
        } else if (this.path == "scenes/main/scene_winner.json" ) {
            const graph = new Graph(data, this.materials);
            graph.build(this.app.scene);

            this.textManager.addTextToScene("YOU WIN!!", 0, 100, 90, 10);
            this.textManager.addTextToScene(">play again", 0, 32, 90, 4,"playAgain")
            this.textManager.addTextToScene(">come back to menu", 0, 22, 90, 4,"menu"); 
            this.addInteractiveObjects();

            const balloonToHide = this.selectedBalloon === "balloon1" ? "balloon2" : "balloon1";
            this.hideBalloon(balloonToHide);



            new ParticleSystem(this.app.scene);
        } else if (this.path == "scenes/main/scene_loser.json" ) {
            const graph = new Graph(data, this.materials);
            graph.build(this.app.scene);

            this.textManager.addTextToScene("YOU LOSE!!", 0, 100, 90, 10);
            this.textManager.addTextToScene(">play again", 0, 32, 90, 4,"playAgain")
            this.textManager.addTextToScene(">come back to menu", 0, 22, 90, 4,"menu"); 
            this.addInteractiveObjects();

            const balloonToHide = this.selectedBalloon;
            this.hideBalloon(balloonToHide);
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();

        this.textManager = new TextManager(this.app.scene); 
        this.printYASF(data);
        this.setupPickingManager();
    }

    addInteractiveObjects() {
        const interactiveNames = ["startButton", 'balloon1', 'balloon2','spaceName','playAgain','menu']; 
        interactiveNames.forEach(name => {
            const object = this.app.scene.getObjectByName(name);
            if (object) {
                this.interactiveObjects.push(object);
            } else {
                console.warn(`Interactive object "${name}" not found.`);
            }
        });

        console.log("Interactive objects added:", this.interactiveObjects);
    }

    setupPickingManager() {
        if (!this.scene || !this.cameras) {
            console.error("Scene or cameras are not initialized.");
            return;
        }
    
        const activeCamera = this.cameras.getActiveCamera();
        if (!activeCamera) {
            console.error("No active camera available for PickingManager.");
            return;
        }
    
        const transitionCallback = async (targetScene, balloonNodeId = 'balloon1') => {
            console.log(`Transitando para a cena: ${targetScene}`);
        
            // Remove todos os filhos da cena atual
            while (this.app.scene.children.length > 0) {
                this.app.scene.remove(this.app.scene.children[0]);
            }
        
            this.path = targetScene;
            this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
            this.reader.open(this.path);
        
        if (targetScene === "scenes/main/scene_game.json") {
            console.log("Configurando rotas e animações para a cena do jogo...");

        this.builder = new MyNurbsBuilder();
        const createNurbsSurface = (builder, controlPoints, degreeU, degreeV, samplesU, samplesV, material, position, rotation, scale) => {
            const geometry = builder.build(controlPoints, degreeU, degreeV, samplesU, samplesV, material);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position.x, position.y, position.z);
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);
            mesh.scale.set(scale.x, scale.y, scale.z);
            return mesh;
        };

        // Shared properties
        const degreeU = 2;  
        const degreeV = 2;  
        const samplesU = 16; 
        const samplesV = 16; 

        const texture = new THREE.TextureLoader().load('scenes/main/textures/floor.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const material = new THREE.MeshBasicMaterial({
            color: "rgb(153,153,153)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 10,
            map: texture
        });

        // Builder instance
        const builder = this.builder;

        // Front side
        const controlPointsFront = [
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
        const meshFront = createNurbsSurface(
            builder, controlPointsFront, degreeU, degreeV, samplesU, samplesV, material,
            { x: 0, y: 0, z: -60 },
            { x: -Math.PI / 1.30, y: 0, z: 0 },
            { x: 60, y: 15, z: 50 }
        );

        // Back side
        const controlPointsBack = [
            [
                [-1.5, 0, -1.5, 1],  
                [-1.5, 0.5, -1, 1],  
                [-1.5, 1, -0.5, 1]  
            ],
            [
                [0, 0, -1.5, 1],     
                [0, 0.5, -1, 1],   
                [0, 1, -0.5, 1]     
            ],
            [
                [1.5, 0, -1.5, 1],  
                [1.5, 0.5, -1, 1], 
                [1.5, 1, -0.5, 1]   
            ]
        ];
        const meshBack = createNurbsSurface(
            builder, controlPointsBack, degreeU, degreeV, samplesU, samplesV, material,
            { x: 0, y: -5.3, z: 30 },
            { x: Math.PI / 1.30, y: 0, z: 0 },
            { x: 60, y: 15, z: 50 }
        );

        // Left side
        const controlPointsLeft = [
            [ 
                [1.5, 0, 0, 1],  
                [1.5, 0.5, 0.5, 1], 
                [1.5, 1, 1, 1]
            ],
            [ 
                [0, 0, 0, 1],     
                [0, 0.5, 1, 1],   
                [0, 1, 2, 1]     
            ],
            [ 
                
                [-1.5, 0, 0, 1],  
                [-1.5, 0.5, 0.5, 1],  
                [-1.5, 1, 1, 1]     
            ]
        ];
        const meshLeft = createNurbsSurface(
            builder, controlPointsLeft, degreeU, degreeV, samplesU, samplesV, material,
            { x: 43, y: 0, z: 0 },
            { x: -Math.PI, y: Math.PI/2 , z: 0 },
            { x: 50, y: -15, z: 40 }
        );

            // Right side
            const controlPointsRight = [
                [ 
                    
                    [1.5, 0, 0, 1],  
                    [1.5, 0.5, 0.5, 1], 
                    [1.5, 1, 1, 1] 
                ],
                [ 
                    [0, 0, 0, 1],     
                    [0, 0.5, 1, 1],   
                    [0, 1, 2, 1]     
                ],
                [ 
                    [-1.5, 0, 0, 1],  
                    [-1.5, 0.5, 0.5, 1],  
                    [-1.5, 1, 1, 1] 
                ]
            ];
            const meshRight = createNurbsSurface(
                builder, controlPointsRight, degreeU, degreeV, samplesU, samplesV, material,
                { x: -44, y: 0, z: 0 },
                { x: 0, y: -Math.PI / 2, z: 0 },
                { x: 50, y: 15, z: 40 }
            );

            // Add meshes to the scene
            this.app.scene.add(meshFront);
            this.app.scene.add(meshBack);
            this.app.scene.add(meshLeft);
            this.app.scene.add(meshRight);


        
                this.routes = new MyRoutes(this.app.scene);
        
                // Define a Catmull-Rom curve
                const points = [
                    new THREE.Vector3(-20, 7, -35),
                    new THREE.Vector3(-22.25, 7, -34),
                    new THREE.Vector3(-24.75, 7, 0),
                    new THREE.Vector3(-19, 7, 33),
                    new THREE.Vector3(0, 7, 45),
                    new THREE.Vector3(20.25, 7, 36),
                    new THREE.Vector3(20.75, 7, 0),
                    new THREE.Vector3(18.25, 7, -32),
                    new THREE.Vector3(0, 7, -47),
                ];
        
                const keyFrames = this.routes.addRoute(points);
        
                const animationDuration = 200;
        
                //Wait one second to set up the scene before starting the animation
                await new Promise((r) => setTimeout(r, 1000));
        
                if (this.graph) {
                    this.graph.animateNode(balloonNodeId, keyFrames, animationDuration);
                }
            }
            else if (targetScene === "scenes/main/scene_winer.json") {

            }
            else if (targetScene === "scenes/main/scene_loser.json") {

            }
        };
    
    
        // Inicializa o PickingManager com o TextManager e TransitionCallback
        this.pickingManager = new PickingManager(
            this.app.scene,
            activeCamera,
            this.interactiveObjects,
            transitionCallback, this.app.display,
            this.app
        );
        this.pickingManager.textManager = this.textManager;
    
        // console.log("PickingManager initialized with interactive objects:", this.interactiveObjects);
    }

    hideBalloon(balloonName) {
        const balloon = this.app.scene.getObjectByName(balloonName);
    
        if (balloon) {
            balloon.visible = false; // Oculta o balão especificado
            console.log(`${balloonName} foi ocultado.`);
        } else {
            console.warn(`O balão ${balloonName} não foi encontrado na cena.`);
        }
    }

    async init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }


    }

    update() {
        if (this.pickingManager) {
        }
    }
}

export { MyContents };