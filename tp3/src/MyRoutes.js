import * as THREE from 'three';

class MyRoutes {


    

    constructor(scene) {
        this.scene = scene;
        //Array of my routes, each route is an array of points
        //Example of a route with 8 points
        // const points = [
        //             new THREE.Vector3(0, 7, -47),
        //             new THREE.Vector3(-22.25, 7, -34),
        //             new THREE.Vector3(-24.75, 7, 0),
        //             new THREE.Vector3(-19, 7, 33),
        //             new THREE.Vector3(0, 7, 45),
        //             new THREE.Vector3(20.25, 7, 36),
        //             new THREE.Vector3(20.75, 7, 0),
        //             new THREE.Vector3(18.25, 7, -32),
        //         ];
        this.routes = [];

    }

    addRoute(points) {
        this.routes.push(points);

        const curve = new THREE.CatmullRomCurve3(points, true);
        // Create the line with that curve
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const curveObject = new THREE.Line(curveGeometry, curveMaterial);
        this.scene.add(curveObject);

        // Generate keyframes based on the curve
        const keyFrames = [];
        const divisions = 10000; // Number of divisions along the curve
        const curvePoints = curve.getPoints(divisions);

        for (let i = 0; i < curvePoints.length; i++) {
            const position = curvePoints[i];
            const tangent = curve.getTangent(i / divisions); // Tangent for rotation
            const rotation = new THREE.Euler().setFromVector3(tangent);

            // Calculate the angle to rotate the object based on the tangent direction
            const angle = Math.atan2(tangent.y, tangent.x);
            rotation.y = angle;
            // rotation.z = Math.PI / 2;

            keyFrames.push({ position, rotation });
        }

        return keyFrames;

    }

    


}

export default MyRoutes;