import * as THREE from 'three';

class MyBalloon {
    constructor(materialBalloon, materialBasket) {
        this.materialBasket = materialBasket;
        this.materialBalloon = materialBalloon;

    }

    createBalloon() {
        const balloon = new THREE.Group();

        const basket = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32),
            this.materialBasket
        );
        basket.position.set(0, -2, 0);
        balloon.add(basket);

        const balloonBody = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 16),
            this.materialBalloon
        );
        balloonBody.position.set(0, 0, 0);
        balloon.add(balloonBody);

        return balloon;
    }


}

export default MyBalloon;
