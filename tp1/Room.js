import Floor from "./Floor.js";
import Plate from "./Plate.js";
import Table from "./Table.js";
import Mat from "./Mat.js";
import Wall from "./Wall.js";
import Chair from "./Chair.js";
import Window from "./Window.js";
import Painting from "./Painting.js";
import Beetle from "./Beetle.js";
import Spiral from "./Spiral.js";
import Vase from './Vase.js';
import Jar from './Jar.js';
import Newspaper from './Newspaper.js'; 
import Newspaper2 from './Newspaper2.js'; 
import Shelf from './Shelf.js';
import Cabinet from './Cabinet.js';

class Room {
    constructor(textures) {
        this.textures = textures;

    }

    draw(scene) {
         //build walls
         const wallAttributes = [
            { x: 0, y: 1.5, z: 4, width: 10, height: 3, material: this.wallsMaterial, rotationX: 0, rotationY: Math.PI, rotationZ: 0, texture: this.textures.wallsMaterial },
            // { x: 0, y: 1.5, z: -4, width: 10, height: 3, material: this.wallsMaterial, rotationX: 0, rotationY: 0, rotationZ: 0, texture: this.textures.wallsMaterial },
            { x: 5, y: 1.5, z: 0, width: 8, height: 3, material: this.wallsMaterial, rotationX: 0, rotationY: -Math.PI / 2, rotationZ: 0, texture: this.textures.wallsMaterial },
            { x: -5, y: 1.5, z: 0, width: 8, height: 3, material: this.wallsMaterial, rotationX: 0, rotationY: Math.PI / 2, rotationZ: 0, texture: this.textures.wallsMaterial }
        ];

        wallAttributes.forEach(attr => {
            const wall = new Wall(attr.x, attr.y, attr.z, attr.width, attr.height, attr.material, attr.rotationX, attr.rotationY, attr.rotationZ, attr.texture);
            wall.draw(scene);
        });
        //Createa a newspaper 
        const newspaper = new Newspaper(this.textures.newspaperTexture);
        newspaper.draw(scene);
        const newspaper2 = new Newspaper2(this.textures.newspaperTexture);
        newspaper2.draw(scene);

        //Createa a Vase with a flower
        const vase = new Vase(1.5, 1.15, -1, this.textures.vaseMaterial); 
        vase.draw(scene);

        //Createa a painting 
        const PaintingAttributes = {
            y: 1.5,
            z: 3.9,
            width: 1.2,
            height: 1.2,
            rotationX: 0,
            rotationY: Math.PI,
            rotationZ: 0
        }

        const paintingBia= new Painting(
            1.5, 
            PaintingAttributes.y, 
            PaintingAttributes.z, 
            PaintingAttributes.width, 
            PaintingAttributes.height, 
            this.textures.paintingBiaMaterial, 
            PaintingAttributes.rotationX, 
            PaintingAttributes.rotationY, 
            PaintingAttributes.rotationZ
        );
        paintingBia.draw(scene);

        const paintingMiguel= new Painting(
            -1.5, 
            PaintingAttributes.y, 
            PaintingAttributes.z, 
            PaintingAttributes.width, 
            PaintingAttributes.height, 
            this.textures.paintingMiguelMaterial,
            PaintingAttributes.rotationX, 
            PaintingAttributes.rotationY, 
            PaintingAttributes.rotationZ
        );
        paintingMiguel.draw(scene); 

        const JarAttributes = {
                x: -3.8,
                y: 0,
                z: 3,
                material: this.textures.jarMaterial
            };

            // Criar e desenhar o lixo
            const jar = new Jar(
                JarAttributes.x,
                JarAttributes.y,
                JarAttributes.z,
                JarAttributes.material
            );
            jar.draw(scene);

        // Createa a window with a shelf
        const shelfAttributes = {
            x: 4.7,    
            y: 2,    
            z: 0,   
            width: 2.5,   
            height: 0.1,  
            depth: 0.5    
        };
        const shelf = new Shelf(
            shelfAttributes.x,
            shelfAttributes.y,
            shelfAttributes.z,
            shelfAttributes.width,
            shelfAttributes.height,
            shelfAttributes.depth,
            this.textures.shelfMaterial
        );
        shelf.draw(scene);

        const cabinetWidth = 2;
        const cabinetHeight = 2.5;
        const cabinetDepth = 1;
        
        // Definir a posição desejada
        const cabinetX = -3.5;
        const cabinetY = 0;
        const cabinetZ = -3.5;

        // Crie o armário na posição desejada
        const cabinet = new Cabinet(
            cabinetWidth,
            cabinetHeight,
            cabinetDepth,
            this.textures.cabinetBodyMaterial,
            this.textures.cabinetDoorMaterial,
            cabinetX,
            cabinetY,
            cabinetZ
        );
        cabinet.draw(scene);

        // Createa a window with a landscape
        const windowAttributes = {
            x: 0,
            y: 1.5,
            z: -4,
            width: 10,
            height: 3,
            material: this.textures.windowMaterial,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            landscape: this.textures.landscapeMaterial
        }

        const window = new Window(windowAttributes.x, windowAttributes.y, windowAttributes.z, windowAttributes.width, windowAttributes.height, windowAttributes.material, windowAttributes.rotationX, windowAttributes.rotationY, windowAttributes.rotationZ, windowAttributes.landscape);
        window.draw(scene);

        //Build the floor
        const floorAtributes = {
            x: 0,
            y: 0,
            width: 10,
            height: 8,
            rotationX: -Math.PI/2,
            rotationY: 0,
            material: this.textures.planeMaterial
        }

        const floor = new Floor(floorAtributes.x,floorAtributes.y,floorAtributes.width,floorAtributes.height,floorAtributes.rotationX,floorAtributes.rotationY,floorAtributes.material);
        floor.draw(scene)

        //Build the mat
        const matAtributes = {
            x: 0,
            y: 0.0001,
            width: 7.5,
            height: 6,
            rotationX: -Math.PI/2,
            rotationY: 0,
            material: this.textures.matMaterial
        }
        const mat = new Mat(matAtributes.x,matAtributes.y,matAtributes.width,matAtributes.height,matAtributes.rotationX,matAtributes.rotationY,matAtributes.material);
        mat.draw(scene);

        //Build the table
        const tableAtributes = {
            width: 2,
            height: 0.15,
            length: 3,
            x: 2,
            y: 1,
            z: 0,
            materialTop: this.textures.tableTopMaterial,
            materialLegs: this.textures.tableLegsMaterial
        }
        const table = new Table(tableAtributes.width,tableAtributes.height,tableAtributes.length,tableAtributes.materialTop, tableAtributes.materialLegs,tableAtributes.x,tableAtributes.y,tableAtributes.z);
        table.draw(scene);

        //Build the chair
        const chairAtributes = {
            width: 0.5,
            height: 0.1,
            length: 0.5,
            x: 0,
            y: 0.6,
            z: 0,
            topMaterial: this.textures.tableTopMaterial,
            legMaterial: this.textures.tableLegsMaterial
        }
        const chairPositions = [
            { x: 0.8, y: 0.6, z: -0.75, rotationY: -Math.PI / 2 },
            { x: -0.8, y: 0.6, z: -0.75, rotationY: -Math.PI / 2 },
            { x: 0.8, y: 0.6, z: 3.25, rotationY: Math.PI / 2 },
            { x: -0.8, y: 0.6, z: 3.25, rotationY: Math.PI / 2 }
        ];

        chairPositions.forEach(pos => {
            const chair = new Chair(chairAtributes.width, chairAtributes.height, chairAtributes.length, chairAtributes.topMaterial, chairAtributes.legMaterial, pos.x, pos.y, pos.z);
            chair.rotateY(pos.rotationY);
            chair.draw(scene);
        });

        //Build the plate
        const plateAtributes = {
            x: 1.7,
            y: tableAtributes.y+tableAtributes.height,
            z: 0.5,
            width: 0.5,
            height: 0.25,
            depth: 0.1,
            color: 0xfc9d9d,
            cake: this.textures.cakeMaterial,
            cakeInside: this.textures.cakeInMaterial
        }

        const plate = new Plate(plateAtributes.x,plateAtributes.y,plateAtributes.z,plateAtributes.width,plateAtributes.height,plateAtributes.depth,plateAtributes.cake, plateAtributes.cakeInside);
        plate.draw(scene);


        //Build the beetle
        const beetleAtributes = {
            material: this.textures.beetleMaterial
        }
        const beetle = new Beetle(beetleAtributes.material);
        beetle.draw(scene);

        //Build the spiral
        const spiralAtributes = {
            material: this.textures.spiralMaterial,
            x: 2.7,
            y: tableAtributes.y+tableAtributes.height+0.045,
            z: 0.8
        }
        const spiral = new Spiral(spiralAtributes.material,spiralAtributes.x,spiralAtributes.y,spiralAtributes.z);
        spiral.draw(scene);
    
    }
    
}

export default Room;