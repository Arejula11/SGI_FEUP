import * as THREE from 'three';


/**
 * Creates a point light
 * @param {Object} childData The light data
 * @returns {THREE.PointLight} The light
 */
export function createPointLight(childData) {
    // console.log(childData);
    const light = new THREE.PointLight(
        new THREE.Color(childData.color.r, childData.color.g, childData.color.b), 
        childData.intensity || 1, 
        childData.distance || 1000, 
        childData.decay || 2
    );
    if (childData.position) {
        light.position.set(childData.position.x || 0, childData.position.y || 0, childData.position.z || 0);
    }
    if (childData.castshadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = childData.shadowmapsize || 512;
        light.shadow.mapSize.height = childData.shadowmapsize || 512;
        light.shadow.far = childData.shadowfar || 500.0;
    }

    return light;
}

/**
 * Creates a spot light
 * @param {Object} childData The light data
 * @param {THREE.Scene} scene The scene
 * @returns {THREE.SpotLight} The light
 */
export function createSpotLight(childData, scene) {

    const light = new THREE.SpotLight(
        new THREE.Color(childData.color.r, childData.color.g, childData.color.b), 
        childData.intensity || 1, 
        childData.distance || 1000, 
        childData.angle || Math.PI / 4, 
        childData.penumbra || 0.1, 
        childData.decay || 2
    );

    if (childData.position) {
        light.position.set(
            childData.position.x || 0, 
            childData.position.y || 0, 
            childData.position.z || 0
        );
    }
    const target = new THREE.Object3D();
    if (childData.target) {
        target.position.set(
            childData.target.x || 0, 
            childData.target.y || 0, 
            childData.target.z || 0
        );
    } else {
        target.position.set(0, 0, 0); // Posición por defecto del target
    }
    light.target = target;
    if (childData.castshadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = childData.shadowmapsize || 512;
        light.shadow.mapSize.height = childData.shadowmapsize || 512;
        light.shadow.camera.far = childData.shadowfar || 500.0;
    }
    scene.add(light);
    scene.add(target);

    return light;
}

/**
 * Creates a directional light
 * @param {Object} childData The light data
 * @returns {THREE.DirectionalLight} The light
 */
export function createDirectionalLight(childData) {
    const light = new THREE.DirectionalLight(
        new THREE.Color(childData.color.r, childData.color.g, childData.color.b), 
        childData.intensity || 1
    );
    if (childData.position) {
        light.position.set(childData.position.x || 0, childData.position.y || 0, childData.position.z || 0);
    }
    if (childData.castshadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = childData.shadowmapsize || 512;
        light.shadow.mapSize.height = childData.shadowmapsize || 512;
        light.shadow.camera.left = childData.shadowleft || -5;
        light.shadow.camera.right = childData.shadowright || 5;
        light.shadow.camera.top = childData.shadowtop || 5;
        light.shadow.camera.bottom = childData.shadowbottom || -5;
        light.shadow.camera.far = childData.shadowfar || 500.0;
    }

    return light;
}