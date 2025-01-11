import * as THREE from 'three';
import { createPointLight, createSpotLight, createDirectionalLight } from './light.js';
import  MyTrack  from './src/MyTrack.js';
import MyPowerUp from './src/MyPowerUp.js';
import MyObstacles from './src/MyObstacles.js';
import MyBalloon from './src/MyBalloon.js';


class Graph {

    /**
     * Constructor
     * @param {Object} graphData The graph data
     * @param {Materials} materials The materials
     */
    constructor(graphData, materials) {
        this.graphData = graphData;
        this.materials = materials;
        this.nodes = {};
        this.scene = null;

    }

    /**
     * Builds the graph
     * @param {THREE.Scene} scene The scene to add the graph to
     */
    build(scene) {
        this.scene = scene;
        const rootId = this.graphData.rootid;
        if (!rootId) {
            console.error("No root ID specified in the graph data.");
            return;
        }
        const rootNode = this.createNode(rootId, null, null);
        if (rootNode) {
            scene.add(rootNode);
        }
    }

    /**
     * Creates a node
     * @param {string} nodeId The node ID
     * @param {string} inheritedMaterial The inherited material
     * @param {Array} inheritedTransforms The inherited transforms
     * @returns {THREE.Group} The node
     */
    createNode(nodeId, inheritedMaterial, inheritedTransforms) {
        // console.log("nodeId ",nodeId, "inheritedMaterial ",inheritedMaterial, "inheritedTransforms ",inheritedTransforms);
        const nodeData = this.graphData[nodeId];
        if (!nodeData) {
            console.error(`Node data for node "${nodeId}" not found.`);
            return null;
        }
        const group = new THREE.Group();

        // Process transforms
        let transforms =  nodeData.transforms || inheritedTransforms || null;
        if (transforms) {
            this.applyTransforms(group, nodeData.transforms);
        }

        // Process material
        let material = null;
        if (nodeData.materialref) {
            material = (nodeData.materialref);
            if (!material) {
                console.warn(`Material "${nodeData.materialref}" not found for node "${nodeId}".`);
            }
        }else if (inheritedMaterial) {
            material = inheritedMaterial;
        }

        group.name = nodeId;

        // Process children nodes
        if (nodeData.children?.nodesList) {
            nodeData.children.nodesList.forEach((childId) => {
                const childNode = this.createNode(childId, material, transforms);
                if (childNode) {
                    group.add(childNode);
                }
            });
        }

        // Process LODs
        if (nodeData.type === 'lod') {
            const lod = new THREE.LOD();
            nodeData.lodsList.forEach((lodEntry) => {
                const childNode = this.createNode(lodEntry.nodeId, material, transforms);
                if (childNode) {
                    const minDist = lodEntry.mindist || 0; // Default to 0 if not specified
                    lod.addLevel(childNode, minDist);
                }
            });
            group.add(lod);
        }
    
        // Process primitives
        if (nodeData.children) {

            Object.entries(nodeData.children).forEach(([key, childData]) => {
                let primitive = null;
                let light = null;
                
                if (childData.type === 'box') {
                    primitive = this.createBox(childData, material);
                } else if (childData.type === 'cylinder') {
                    primitive = this.createCylinder(childData, material);
                } else if (childData.type === 'rectangle') {
                    primitive = this.createRectangle(childData, material);
                } else if (childData.type === 'cone') {
                    primitive = this.createCone(childData, material);
                } else if (childData.type === 'dode') {
                    primitive = this.createDode(childData, material);
                }else if (childData.type === 'track') {
                    primitive = this.createTrack(childData, material);
                }else if (childData.type === 'powerup') {
                    primitive = this.createPowerUp(childData, material);
                }else if (childData.type === 'obstacle') {
                    primitive = this.createObstacle(childData, material);
                }else if (childData.type === 'balloon') {
                    primitive = this.createBalloon(childData, material);
                }else if (childData.type === 'circle') {
                    primitive = this.createCircle(childData, material);
                } else if (childData.type === 'sphere') {
                    primitive = this.createSphere(childData, material);
                } else if (childData.type === 'pointlight') {
                    light = createPointLight(childData);
                } else if (childData.type === 'spotlight') {
                    light = createSpotLight(childData, this.scene);
                } else if (childData.type === 'directionallight') {
                    light = createDirectionalLight(childData);
                } 
    
                if (primitive) {
                    if (childData.name) {
                        primitive.name = childData.name; 
                    }
                    group.add(primitive);
                }

                if (light) {
                    group.add(light);
                }
            });
        }
    
        this.nodes[nodeId] = group; 
        return group;
        
    }
    
    /**
     * Applies transforms to a group
     * @param {THREE.Group} group The group
     * @param {Array} transforms The transforms
     */
    applyTransforms(group, transforms) {
        if (!transforms) return;

        transforms.forEach(transform => {
            switch (transform.type) {
                case 'translate': 
                    group.position.set(transform.amount.x || 0, transform.amount.y || 0, transform.amount.z || 0);
                    break;
                case 'rotate': 
                    group.rotation.set(
                        THREE.MathUtils.degToRad(transform.amount.x || 0),
                        THREE.MathUtils.degToRad(transform.amount.y || 0),
                        THREE.MathUtils.degToRad(transform.amount.z || 0)
                    );
                    break;
                case 'scale': 
                    group.scale.set(transform.amount.x || 1, transform.amount.y || 1, transform.amount.z || 1);
                    break;
                default: 
                    break;
            }
        });
    }

    /**
     * Creates a box
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The box
     */
    createBox(childData, materialKey) { 
        // console.log("Box ",childData);
        const geometry = new THREE.BoxGeometry(
            childData.xyz2.x - childData.xyz1.x,
            childData.xyz2.y - childData.xyz1.y,
            childData.xyz2.z - childData.xyz1.z
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a cylinder
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The cylinder
     */
    createCylinder(childData, materialKey) { 
        const geometry = new THREE.CylinderGeometry(
            childData.base,
            childData.top,
            childData.height,
            childData.slices,
            childData.stacks,
            childData.capsclose
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a rectangle
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The rectangle
     */
    createRectangle(childData, materialKey) { 
        const geometry = new THREE.PlaneGeometry(
            Math.abs(childData.xy2.x - childData.xy1.x),
            Math.abs(childData.xy2.y - childData.xy1.y)
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a cone
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The cone
     */
    createCone(childData, materialKey) { 
        const geometry = new THREE.ConeGeometry(
            childData.base,
            childData.height,
            childData.slices,
            childData.stacks,
            childData.capsclose
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a dodecahedron
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The dodecahedron
     */
    createDode(childData, materialKey) { 
        const geometry = new THREE.DodecahedronGeometry(
            childData.radius,
            childData.detail
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a circle
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The circle
     */
    createCircle(childData, materialKey) { 
        const geometry = new THREE.CircleGeometry(
            childData.radius,
            childData.segments,
            childData.startAngle,
            childData.angleLength
        );  
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a sphere
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {THREE.Mesh} The sphere
     */
    createSphere(childData, materialKey) { 
        const geometry = new THREE.SphereGeometry(
            childData.radius,
            childData.slices,
            childData.stacks,
            childData.thetastart || 0,
            childData.thetalength || Math.PI * 2,
            childData.phistart || 0,
            childData.philength || Math.PI
        );
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a track
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {MyTrack} The track
     */
    createTrack(childData, materialKey) { 
                
        const points = childData.points.map(point => new THREE.Vector3(point.x, point.y, point.z));
        const curve = new THREE.CatmullRomCurve3(points, true);
        const material = this.materials.getMaterial(materialKey);
        const track = new MyTrack(material, curve, childData.width, childData.number_segments);
        return track.createTrack()
    }
    /**
     * Creates a powerup
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {MyPowerUp} The powerup
     */
    createPowerUp(childData, materialKey) { 
        const material = this.materials.getMaterial(materialKey);       
        const powerUp = new MyPowerUp(material);
        return powerUp.createPowerUp();
    }
    /**
     * Creates an obstacle
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {MyObstacles} The obstacle
     */
    createObstacle(childData, materialKey) { 
        const material = this.materials.getMaterial(materialKey);       
        const obstacle = new MyObstacles(material);
        return obstacle.createObstacle();
    }
    /**
     * Creates a balloon
     * @param {Object} childData The child data
     * @param {String} materialKey The material key
     * @returns {MyBalloon} The balloon
     */
    createBalloon(childData, materialKey) { 
        const mat1 = { materialId: materialKey.materialId };
        const mat2 = { materialId: materialKey.materialId2 };
        const material1 = this.materials.getMaterial(mat1);
        const material2 = this.materials.getMaterial(mat2);
        
        const balloon = new MyBalloon(material1, material2);
        const balloonMesh = balloon.createBalloon();
    
        return balloonMesh;
    }

    /**
         * Animate an object along a route.
         * @param {string} nodeId The ID of the node to animate
         * @param {Array} keyFrames The keyframes for the animation
         * @param {number} duration The animation duration in seconds
         */
        async animateNode(nodeId, keyFrames, duration) {
            await new Promise((r) => setTimeout(r, 1000));
            const node = this.nodes[nodeId];
            if (!node) {
                console.error(`Node with ID "${nodeId}" not found.`);
                return;
            }

            let isPaused = false; // Variable para verificar si la animación está pausada
            const clock = new THREE.Clock();
            let elapsed = 0;

            // Función para controlar la pausa con la tecla 'space'
            window.addEventListener('keydown', (event) => {
                if (event.key === ' ') {
                    isPaused = !isPaused; // Cambiar el estado de la pausa
                    console.log(isPaused ? 'Pausado' : 'Reanudado');
                    if (!isPaused) {
                        // Si se reanuda, restablecemos el reloj para que no salte la animación
                        clock.start();
                    } else {
                        // Si se pausa, guardamos el tiempo transcurrido y detenemos el reloj
                        clock.stop();
                    }
                }
            });

            const startPosition = new THREE.Vector3(-20, 7, -35);

            // Stage 1: Move the object to the start of the curve
            await this.moveToStart(node, startPosition);

            

            const animate = () => {

                //when appers in html game status: finished the animation should stop
                const gameStatusElement = document.getElementById('game-status');
                // console.log(gameStatusElement);
                if (gameStatusElement && gameStatusElement.innerText === 'Finished') {
                    return; // Detener la animación si el estado del juego es "finished"
                }

                if (isPaused) {
                    // Si está pausado, no hacer nada y esperar para reanudar
                    requestAnimationFrame(animate);
                    return;
                }

                elapsed += clock.getDelta();
                const t = (elapsed / duration) % 1; // Normalizar el tiempo (0 a 1)

                // Índices de los fotogramas clave actuales y siguientes
                const index = Math.floor(t * (keyFrames.length - 1));
                const nextIndex = (index + 1) % keyFrames.length;

                // Factor de interpolación entre los fotogramas clave
                const alpha = (t * (keyFrames.length - 1)) % 1;
                const currentKeyframe = keyFrames[index];
                const nextKeyframe = keyFrames[nextIndex];

                // Interpolación de posición
                node.position.lerpVectors(currentKeyframe.position, nextKeyframe.position, alpha);

                // Calcular la dirección del movimiento
                const direction = new THREE.Vector3().subVectors(nextKeyframe.position, currentKeyframe.position).normalize();

                // Calcular la rotación en el eje Y (yaw) para que el objeto mire hacia la dirección del movimiento
                const angle = Math.atan2(direction.x, direction.z);
                node.rotation.set(0, angle, 0); // Rotación solo en el eje Y

                // Continuar animación
                requestAnimationFrame(animate);
            };

            animate();
        }



        /**
     * Moves the object directly to the start of the curve.
     * @param {THREE.Object3D} node The object to move.
     * @param {THREE.Vector3} targetPosition The starting position.
     * @returns {Promise} Resolves once the object reaches the target position.
     */
    moveToStart(node, targetPosition) {
        return new Promise((resolve) => {
            let isPaused = false; // Variable para verificar si la animación está pausada
            const clock = new THREE.Clock();
            let elapsed = 0;

            // Función para controlar la pausa con la tecla 'space'
            window.addEventListener('keydown', (event) => {
                if (event.key === ' ') {
                    isPaused = !isPaused; // Cambiar el estado de la pausa
                    console.log(isPaused ? 'Pausado' : 'Reanudado');
                    if (!isPaused) {
                        // Si se reanuda, restablecemos el reloj para que no salte la animación
                        clock.start();
                    } else {
                        // Si se pausa, guardamos el tiempo transcurrido y detenemos el reloj
                        clock.stop();
                    }
                }
            });
            const moveDuration = 4.0; // Duration to reach the starting point
            const startPosition = node.position.clone();
            const direction = new THREE.Vector3()
                .subVectors(targetPosition, startPosition)
                .normalize();
            const distance = startPosition.distanceTo(targetPosition);

            const animateMove = () => {
                if (isPaused) {
                    // Si está pausado, no hacer nada y esperar para reanudar
                    requestAnimationFrame(animateMove);
                    return;
                }
                const delta = clock.getDelta();
                const step = direction.clone().multiplyScalar((distance / moveDuration) * delta);
                const newPosition = node.position.clone().add(step);

                if (newPosition.distanceTo(targetPosition) < step.length()) {
                    node.position.copy(targetPosition); // Snap to target
                    resolve(); // Resolve promise when reached
                    return;
                }

                node.position.copy(newPosition); // Update position
                requestAnimationFrame(animateMove); // Continue animation
            };

            clock.start();
            animateMove();
        });}

}

export default Graph;
