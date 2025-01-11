import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import Room from './Room.js';



/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        //Floor texture
        this.textures = this.setTextures();
    }

    /**
     * initializes the contents
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            // this.app.scene.add(this.axis)
        }
        this.setLights(this.app.scene);

        // create the room
        const room = new Room(this.textures);
        room.draw(this.app.scene); 
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
     /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
     update() {
        // check if box mesh needs to be updated
        // this.updateBoxIfRequired()

        // // sets the box mesh position based on the displacement vector
        // this.boxMesh.position.x = this.boxDisplacement.x
        // this.boxMesh.position.y = this.boxDisplacement.y
        // this.boxMesh.position.z = this.boxDisplacement.z
        
    }
    
    /**
     * sets the textures of the objects in the scene
     * @returns {Object} the textures
     *  
     */
    setTextures() {
        const textures = {};

        textures.planeTexture = new THREE.TextureLoader().load('textures/floor-parquet.jpg');
        textures.planeTexture.wrapS = THREE.RepeatWrapping;
        textures.planeTexture.wrapT = THREE.RepeatWrapping;
        textures.planeMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.planeTexture
        });
        textures.paintingBiaTexture = new THREE.TextureLoader().load('textures/bia.jpg');
        textures.paintingBiaTexture.wrapS = THREE.RepeatWrapping;
        textures.paintingBiaTexture.wrapT = THREE.RepeatWrapping;
        textures.paintingBiaMaterial = new THREE.MeshStandardMaterial({
            map: textures.paintingBiaTexture,
            side: THREE.DoubleSide,
            color: "rgb(255,255,255)",
            emissive: "rgb(30,30,30)",  
            roughness: 0.7,             
            metalness: 0.1  
        });

        textures.paintingMiguelTexture = new THREE.TextureLoader().load('textures/Miguel.jpg');
        textures.paintingMiguelTexture.wrapS = THREE.RepeatWrapping;
        textures.paintingMiguelTexture.wrapT = THREE.RepeatWrapping;
        textures.paintingMiguelMaterial = new THREE.MeshStandardMaterial({
            map: textures.paintingMiguelTexture,
            side: THREE.DoubleSide,
            color: "rgb(255,255,255)",
            emissive: "rgb(30,30,30)",  
            roughness: 0.7,             
            metalness: 0.1  
        });

        textures.newspaperTexture = new THREE.TextureLoader().load('textures/newspaper.jpg');
        
        textures.jarTexture = new THREE.TextureLoader().load('textures/jar.jpg');
        textures.jarTexture.wrapS = THREE.RepeatWrapping;
        textures.jarTexture.wrapT = THREE.RepeatWrapping;
        textures.jarMaterial = new THREE.MeshStandardMaterial({
            map: textures.jarTexture,
            color: 0xffffff, 
            emissive: "rgb(10,10,10)",  
            metalness: 0.5,
            roughness: 0.3,
            side: THREE.DoubleSide
        });

        textures.vaseMaterial = new THREE.MeshStandardMaterial({
            color: "#CC7722", 
            metalness: 0.5,
            roughness: 0.3,
            side: THREE.DoubleSide
        });

        textures.matTexture = new THREE.TextureLoader().load('textures/mat.jpg');
        textures.matTexture.wrapS = THREE.RepeatWrapping;
        textures.matTexture.wrapT = THREE.RepeatWrapping;
        textures.matMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.matTexture
        });

        textures.wallTexture = new THREE.TextureLoader().load('textures/wall.jpg');
        textures.wallTexture.wrapS = THREE.RepeatWrapping;
        textures.wallTexture.wrapT = THREE.RepeatWrapping;
        textures.wallsMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.wallTexture
        });

        // Load the texture
        textures.windowTexture = new THREE.TextureLoader().load('textures/wall.jpg');
        textures.windowTexture.wrapS = THREE.RepeatWrapping;
        textures.windowTexture.wrapT = THREE.RepeatWrapping;
        textures.windowTexture.repeat.set(3, 1); 

        // Create the material
        textures.windowMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            emissive: "#000000",
            roughness: 1,        
            metalness: 0,        
            map: textures.windowTexture
        });

        textures.jarTexture = new THREE.TextureLoader().load('textures/jar.jpg');
        textures.jarTexture.wrapS = THREE.RepeatWrapping;
        textures.jarTexture.wrapT = THREE.RepeatWrapping;
        textures.jarMaterial = new THREE.MeshStandardMaterial({
            map: textures.jarTexture,
            color: 0xffffff, 
            emissive: "rgb(10,10,10)",  
            metalness: 0.5,
            roughness: 0.3,
            side: THREE.DoubleSide
        });

        textures.shelfTexture = new THREE.TextureLoader().load('textures/table-wood.jpg');
        textures.shelfTexture.wrapS = THREE.RepeatWrapping;
        textures.shelfTexture.wrapT = THREE.RepeatWrapping;
        textures.shelfMaterial = new THREE.MeshStandardMaterial({
            map: textures.shelfTexture,
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0
        });

        textures.cabinetBodyTexture = new THREE.TextureLoader().load('textures/table-wood.jpg');
        textures.cabinetBodyTexture.wrapS = THREE.RepeatWrapping;
        textures.cabinetBodyTexture.wrapT = THREE.RepeatWrapping;
        textures.cabinetBodyMaterial = new THREE.MeshStandardMaterial({
            map: textures.cabinetBodyTexture,
            side: THREE.DoubleSide,
            color: "rgb(220,200,180)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0
        });

        textures.cabinetDoorTexture = new THREE.TextureLoader().load('textures/table-wood.jpg');
        textures.cabinetDoorTexture.wrapS = THREE.RepeatWrapping;
        textures.cabinetDoorTexture.wrapT = THREE.RepeatWrapping;
        textures.cabinetDoorMaterial = new THREE.MeshStandardMaterial({
            map: textures.cabinetDoorTexture,
            side: THREE.DoubleSide,
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0
        });

        textures.landscapeTexture = new THREE.TextureLoader().load('textures/feup_entry.jpg');
        textures.landscapeTexture.wrapS = THREE.RepeatWrapping;
        textures.landscapeTexture.wrapT = THREE.RepeatWrapping;
        textures.landscapeMaterial = new THREE.MeshBasicMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(255,255,255)",
            emissive: "#000000",
            shininess: 0,
            map: textures.landscapeTexture
        });

        textures.tableTopTexture = new THREE.TextureLoader().load('textures/table-wood.jpg');
        textures.tableTopTexture.wrapS = THREE.RepeatWrapping;
        textures.tableTopTexture.wrapT = THREE.RepeatWrapping;
        textures.tableTopMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.tableTopTexture
        });

        textures.tableLegsTexture = new THREE.TextureLoader().load('textures/legs.webp');
        textures.tableLegsTexture.wrapS = THREE.RepeatWrapping;
        textures.tableLegsTexture.wrapT = THREE.RepeatWrapping;
        textures.tableLegsMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.tableLegsTexture
        });
        
        textures.cakeTexture = new THREE.TextureLoader().load('textures/cake.webp');
        textures.cakeTexture.wrapS = THREE.RepeatWrapping;
        textures.cakeTexture.wrapT = THREE.RepeatWrapping;
        textures.cakeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 100,
            map: textures.cakeTexture
        });
        
        textures.cakeInTexture = new THREE.TextureLoader().load('textures/inside_cake.jpg');
        textures.cakeInTexture.wrapS = THREE.RepeatWrapping;
        textures.cakeInTexture.wrapT = THREE.RepeatWrapping;
        textures.cakeInMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: "rgb(255,255,255)",
            specular: "rgb(0,0,0)",
            emissive: "#000000",
            shininess: 0,
            map: textures.cakeInTexture
        });

        textures.beetleMaterial = new THREE.LineBasicMaterial({
            color: "rgb(255,255,255)"
        });

        textures.spiralMaterial = new THREE.LineBasicMaterial({
            color: "rgb(168, 168, 163)"
        });

        return textures;
    }
    
    /**
     * sets the lights of the scene
     * @param {THREE.Scene} scene
     *  
     **/    
setLights(scene) {
    const sphereSize = 0.1;

    // DirectionalLight
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set( 0, 1.5, -5.2);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    scene.add(this.directionalLight);

    // Window light
    RectAreaLightUniformsLib.init();
    const windowLight = new THREE.RectAreaLight( 0xffffff, 5, 10/3,3/3  );
    windowLight.position.set( 0, 1.5, -4.2 ); 
    windowLight.lookAt( 0, 1.5, 0 ); 
    scene.add( windowLight ); 

    // Beetle light
    this.beetleLight = new THREE.RectAreaLight(0xffffff, 0.5, 4, 2);
    this.beetleLight.position.set(-4, 1.5, 0);
    this.beetleLight.lookAt(-5, 1.5, 0);
    scene.add(this.beetleLight);

    // Picures light
    this.pictureLight = new THREE.RectAreaLight(0xffffff, 2, 1.2, 1.2);
    this.pictureLight.position.set(1.5, 1.5, 3);
    this.pictureLight.lookAt(1.5, 1.5, 3.9);
    scene.add(this.pictureLight);

    
    this.pictureLight2 = new THREE.RectAreaLight(0xffffff, 2, 1.2, 1.2);
    this.pictureLight2.position.set(-1.5, 1.5, 3);
    this.pictureLight2.lookAt(-1.5, 1.5, 3.9);
    scene.add(this.pictureLight2);


    
  
    // SpotLight
    this.spotLight = new THREE.SpotLight(0xffffff, 5, 8, 0.2, 0, 1);
    this.spotLight.castShadow = true;
    this.spotLight.position.set(2, 3.5, 2);
    this.spotLight.target.position.set(1.7, 1, 0.5);
    scene.add(this.spotLight);
    scene.add(this.spotLight.target);
    // scene.add(new THREE.PointLightHelper(this.spotLight, sphereSize));

    this.floweLight = new THREE.SpotLight(0xffffff, 4, 8, 0.18, 0, 1);
    this.floweLight.castShadow = true;
    this.floweLight.position.set(1.5, 3, 0.5);
    this.floweLight.target.position.set(1.5, 1.5, -1);
    scene.add(this.floweLight);
    scene.add(this.floweLight.target);
    // scene.add(new THREE.PointLightHelper(this.floweLight, sphereSize));

    // Luz ambiente
    this.ambientLight = new THREE.AmbientLight(0x555555, 2);
    scene.add(this.ambientLight);
}


}

export { MyContents };