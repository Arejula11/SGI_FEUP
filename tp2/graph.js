import * as THREE from 'three';
import { createPointLight, createSpotLight, createDirectionalLight } from './light.js';


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
                } else if (childData.type === 'circle') {
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
}

export default Graph;
