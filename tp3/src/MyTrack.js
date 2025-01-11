import * as THREE from 'three';

class MyTrack {
    constructor(material, curve, trackWidth = 10, segments = 100) {
        this.material = material;
        this.curve = curve;
        this.trackWidth = trackWidth;
        this.segments = segments;
        this.mesh = null; // The track mesh
    }

    createTrack() {
        const positions = [];
        const indices = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = i / this.segments;
            const point = this.curve.getPoint(t);
            const tangent = this.curve.getTangent(t).normalize();

            // Calculate left and right points for the track
            const left = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(this.trackWidth / 2);
            const right = new THREE.Vector3(tangent.z, 0, -tangent.x).multiplyScalar(this.trackWidth / 2);

            const leftPoint = point.clone().add(left);
            const rightPoint = point.clone().add(right);

            // Add positions for left and right points
            positions.push(leftPoint.x, leftPoint.y, leftPoint.z);
            positions.push(rightPoint.x, rightPoint.y, rightPoint.z);

            // Add indices for faces
            if (i < this.segments) {
                const base = i * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 1, base + 3, base + 2);
            }
        }

        const trackGeometry = new THREE.BufferGeometry();
        trackGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        trackGeometry.setIndex(indices);
        trackGeometry.computeVertexNormals(); 

        return new THREE.Mesh(trackGeometry, this.material);

        

    }


}

export default MyTrack;
