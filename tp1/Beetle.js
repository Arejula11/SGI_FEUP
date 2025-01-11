import * as THREE from 'three';


class Beetle {

     constructor(material) {
        this.material = material;
     }

    draw(scene) {
        const beetle = new THREE.Group();

        //Define de functions
        const createCurve = (points) => {
            const curve = new THREE.CubicBezierCurve3(...points);
            return curve.getPoints(100);
        };

        const createLine = (points, material, position) => {
            const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(curveGeometry, material);
            line.position.copy(position);
            return line;
        };

        //Define the points of the curves
        const curvesData = [
            {
                //Right bottom curve
                points: [
                    new THREE.Vector3(1.5, 0, 0),
                    new THREE.Vector3(1.5, 0.82845, 0),
                    new THREE.Vector3(0.82845, 1.5, 0),
                    new THREE.Vector3(0, 1.5, 0),
                ],
                position: new THREE.Vector3(1, 0, 0),
            },
            {
                //Right top curve
                points: [
                    new THREE.Vector3(1.5, 0, 0),
                    new THREE.Vector3(1.5, 0.82845, 0),
                    new THREE.Vector3(0.82845, 1.5, 0),
                    new THREE.Vector3(0, 1.5, 0),
                ],
                position: new THREE.Vector3(-0.5, 1.5, 0),
            },
            {
                //Left top curve
                points: [
                    new THREE.Vector3(-1.5*2, 0, 0),
                    new THREE.Vector3(-1.5*2, 0.82845 * 2, 0),
                    new THREE.Vector3(-0.82845 * 2, 1.5*2, 0),
                    new THREE.Vector3(0, 1.5*2, 0),
                ],
                position: new THREE.Vector3(-0.5, 0, 0),
            },
            {
                //Left wheel
                points: [
                    new THREE.Vector3(-1, 0, 0),
                    new THREE.Vector3(-1, 1.333, 0),
                    new THREE.Vector3(1, 1.333, 0),
                    new THREE.Vector3(1, 0, 0),
                ],
                position: new THREE.Vector3(-2.5, 0, 0),
            },
            {   
                //Right wheel
                points: [
                    new THREE.Vector3(-1, 0, 0),
                    new THREE.Vector3(-1, 1.333, 0),
                    new THREE.Vector3(1, 1.333, 0),
                    new THREE.Vector3(1, 0, 0),
                ],
                position: new THREE.Vector3(1.5, 0, 0),
            },
        ];

        //Create the curves
        curvesData.forEach((data, index) => {
            const sampledPoints = createCurve(data.points);
            const line = createLine(sampledPoints, this.material, data.position);
            beetle.add(line);
        });

        //Add & set the position, rotation and scale of the beetle
        beetle.scale.set(0.5, 0.5, 0.5);
        beetle.rotateY(Math.PI / 2);
        beetle.position.set(-5, 1, 0);
        scene.add(beetle);
    }

}

export default Beetle;