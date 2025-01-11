import * as THREE from 'three';

class MyBalloonController {
    constructor(scene, balloonName, display, app) {
        this.scene = scene;
        this.balloon = this.scene.getObjectByName(balloonName);
        let oppositeName = null;
        if (balloonName === 'balloon1') {
            oppositeName = 'balloon2';
        }else{
            oppositeName = 'balloon1';
        }
        this.opposite = this.scene.getObjectByName(oppositeName);
        if (!this.balloon) {
            console.error(`Balloon with name "${balloonName}" not found.`);
            return;
        }
        this.finishLane = this.scene.getObjectByName('finishLane');
        this.obstacle1 = this.scene.getObjectByName('cloud1');
        this.obstacle2 = this.scene.getObjectByName('cloud2');
        this.powerup1 = this.scene.getObjectByName('powerup1');
        this.powerup2 = this.scene.getObjectByName('powerup2');
        if (!this.finishLane) {
            console.error('Finish line object (finishLane) not found.');
            return;
        }
        this.innerRadius = 18; // Inner radius (hole in the middle) 
        this.outerRadius = 45; // Outer radius (total radius of the track)


        this.track = this.scene.getObjectByName('track');
        if (!this.track) {
            console.error('Track object not found.');
            return;
        }

        this.display = display;
        this.app = app;
        this.camera = false;

        this.verticalSpeed = 0.05; // Speed of vertical movement
        this.horizontalSpeed = 0.02; // Speed of horizontal movement
        this.keys = {
            w: false,
            s: false,
        };

        this.isPaused = false; // Flag to pause the game
        this.isAnimating = false; // Flag to animate the game
        this.isGameOver = false; // Flag to end the game

        this.laps = 0; //Number of laps completed
        this.requiredLaps = 2; //Number of laps required to finish the game
        this.hasCrossedLine = false; //Flag to avoid multiple detections

        this.timeLimit = 360; // Limit of time to finish the game
        this.remainingTime = this.timeLimit; // Remaining time to finish the game

        this.powerUpCount = 0; // power-ups collected
        this.collisionPauseDuration = 2; // Duration of pause after collision
        this.isCollisionPaused = false; // Flag to pause the game after collision


        //Start the functions in background
        this.initControls();
        this.initPauseControl();
        this.initEscapeControl();
        this.initCamerasControl();
        this.animate();
        this.initTimer();
    }

    /**
     * Set up the keyboard controls for the balloon
     */
    initControls() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'w') this.keys.w = true;
            if (event.key === 's') this.keys.s = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'w') this.keys.w = false;
            if (event.key === 's') this.keys.s = false;
        });
    }

    

    /*
     * Set up the keyboard controls for the cameras
     */
    initCamerasControl() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'c') {
                if (this.camera === true) {
                    this.app.followObjectThreePerson(this.balloon.name);
                    this.camera = false;
                } else {
                    this.app.followObject(this.balloon.name);
                    this.camera = true;
                }
            }
        });
    }

    /*
    * Set up the keyboard controls for the pause
    */
    initPauseControl() {
        window.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (this.isPaused) {
                    this.isPaused = false; // Restart the game
                    this.display.updateGameStatus('Running');
                    if (!this.isAnimating) {
                        this.animate(); // Start the animation
                    }
                } else {
                    this.isPaused = true; // Pause the game
                    this.display.updateGameStatus('Paused');
                }
            }
        });
    }

    /*
    * Set up the keyboard controls for the escape
    */
    initEscapeControl() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.isGameOver = true; // Set the game as over
                this.stopGame(); // Stop the game
            }
        });
    }

    /*
    * Stop the game
    */
    stopGame() {
        this.display.updateGameStatus('Finished');
        this.isPaused = true; // Pause the game
        this.isAnimating = false; // Stop the animation
        cancelAnimationFrame(this.animationId); // Stop the animation frame

        
        alert("Game Over! The game has ended.");
    }

    /*
    * Get the wind direction based on the balloon's height
    */
    getWindDirection() {
        const yPosition = this.balloon.position.y;

        if (yPosition > 23) {
            return 'west'; // Layer 4: wind against the West
        } else if (yPosition > 18) {
            return 'east'; // Layer 3: wind against the East
        } else if (yPosition > 13) {
            return 'south'; // Layer 2: wind against the South
        } else if (yPosition > 8) {
            return 'north'; // Layer 1: wind against the North
        } else {
            return 'none'; // Layer 0: no wind
        }
    }

    /*
    * Check if the balloon has crossed the finish line
    */
    checkLineCrossing() {
        const balloonPosition = this.balloon.position;
        const finishLineBox = new THREE.Box3().setFromObject(this.finishLane);

        // Check if the balloon is within the finish line's bounding box in the XZ plane
        if (
            balloonPosition.x >= finishLineBox.min.x &&
            balloonPosition.x <= finishLineBox.max.x &&
            balloonPosition.z >= finishLineBox.min.z &&
            balloonPosition.z <= finishLineBox.max.z
        ) {
            if (!this.hasCrossedLine) {
                this.hasCrossedLine = true; // Avoid multiple detections
                this.laps++; // Increment lap counter
                this.display.updateLaps(this.laps, this.requiredLaps); // Update UI



                if (this.laps >= this.requiredLaps) {
                    this.isGameOver = true; // End the game
                    this.stopGame();

                }
            }
        } else {
            this.hasCrossedLine = false; // Reset when the balloon is not within the line
        }
    }

    /*
    * Initialize the timer to count down the remaining time
    */
    initTimer() {
        this.display.updateTimer(this.remainingTime); // Update the UI initially
        this.timerInterval = setInterval(() => {
            if (this.isPaused || this.isGameOver) return; // Do not count down if paused or over

            this.remainingTime -= 1; // Decrement remaining time
            this.display.updateTimer(this.remainingTime); // Update UI

            if (this.remainingTime <= 0) {
                this.isGameOver = true; // End the game
                this.stopGame();
            }
        }, 1000); // Update every second
    }


    /**
    * Check for collisions with power-ups and obstacles
    */
    checkCollisions() {
        const balloonBox = new THREE.Box3().setFromObject(this.balloon);

        // Flag to track whether collision detection is currently active
        if (this.isCollisionActive) {
            return; // If collision is active, do not perform further collision checks
        }

        // Set the flag to prevent multiple detections within a short period
        this.isCollisionActive = true;

        // Obstacles
        const obstacles = [this.obstacle1, this.obstacle2];
        obstacles.forEach((obstacle) => {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);

            if (balloonBox.intersectsBox(obstacleBox)) {
                if (this.powerUpCount > 0) {
                    // Use a power-up to avoid penalty
                    this.powerUpCount--;
                    this.display.updateVouchers(this.powerUpCount); // Update UI
                } else {
                    // Collision without power-up: pause and move back
                    this.handleCollision();
                }
            }
        });

        // Power-ups
        const powerUps = [this.powerup1, this.powerup2];
        powerUps.forEach((powerup) => {
            const powerupBox = new THREE.Box3().setFromObject(powerup);

            // Check if power-up has already been collected
            if (balloonBox.intersectsBox(powerupBox)) {
                this.powerUpCount++;
                this.display.updateVouchers(this.powerUpCount); // Update UI
                // Optional: Reset the collected flag after a cooldown (if needed)
                setTimeout(() => {
                    powerup.userData.collected = false;
                }, 10000); // Cooldown in milliseconds
            }
        });

        //oposite balloon
        const oppositeBox = new THREE.Box3().setFromObject(this.opposite);
        if (balloonBox.intersectsBox(oppositeBox)) {
            if (this.powerUpCount > 0) {
                // Use a power-up to avoid penalty
                this.powerUpCount--;
                this.display.updateVouchers(this.powerUpCount); // Update UI
            } else {
                // Collision without power-up: pause and move back
                this.handleCollision();
            }
        }

        // Reset the collision flag after a short delay
        setTimeout(() => {
            this.isCollisionActive = false;
        }, 3000); // Adjust this time as needed to prevent multiple detections
    }

    /**
     * Handle collision logic, including moving the balloon back and pausing
     */
    handleCollision() {
        const initialZ = this.balloon.position.z;
        const targetZ = initialZ - 4; // Adjust Z position after collision
        const duration = this.collisionPauseDuration; // Pause duration in seconds
        const clock = new THREE.Clock();

        // Smooth backward movement
        const animateBackward = () => {
            const elapsed = clock.getElapsedTime();
            const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]
            this.balloon.position.z = initialZ - ((initialZ - targetZ) * progress);

            if (progress < 1) {
                requestAnimationFrame(animateBackward);
            } else {
                this.display.updateGameStatus('Running');
            }
        };

        // Update game status to show pause
        this.display.updateGameStatus('Paused due to obstacle!');
        animateBackward();
    }


    // Method to check if the balloon is out of bounds and apply penalty
    checkOutOfBounds() {
        const balloonPosition = this.balloon.position;

        // Calculate distance from the center of the track (assuming it's circular)
        const distanceFromCenter = Math.sqrt(balloonPosition.x * balloonPosition.x + balloonPosition.z * balloonPosition.z);

        

        // Check if the balloon is outside the track (outside outer radius or inside inner radius)
        if (distanceFromCenter < this.innerRadius ) {
            console.log('Balloon is out of bounds, applying penalty!');
            this.applyPenalty(2);
        }else if (distanceFromCenter > this.outerRadius) {
            console.log('Balloon is out of bounds, applying penalty!');
            this.applyPenalty(1);
        }
    }

    // Method to apply penalty when the balloon is out of bounds
    applyPenalty(num) {
        console.log("out of bounds");
        const initialX = this.balloon.position.x;
        let targetX;
        const initialZ = this.balloon.position.z;
        const targetZ = initialZ - 7; // Adjust Z position after collision
        if (num === 1) {
             targetX = initialX + 7; // Adjust X position after collision
        } else {
             targetX = initialX - 7;
         } // Adjust X position after collision
        const duration = this.collisionPauseDuration; // Pause duration in seconds
        const clock = new THREE.Clock();

        // Smooth backward movement
        const animateBackwardPenalty = () => {
            const elapsed = clock.getElapsedTime();
            const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]
            this.balloon.position.x = initialX - ((initialX - targetX) * progress);
            this.balloon.position.z = initialZ - ((initialZ - targetZ) * progress);
            if (progress < 1) {
                requestAnimationFrame(animateBackwardPenalty);
            } else {
                this.display.updateGameStatus('Running');
            }
        };
        this.display.updateGameStatus('Paused due to obstacle!');
        animateBackwardPenalty();

        
    }



    /*
    * Animate the balloon's movement based on the wind direction and user input
    */
    animate() {
        if (this.isPaused || this.isGameOver || this.isCollisionPaused) {
            this.isAnimating = false;
            return;
        }

        this.isAnimating = true;

        const update = () => {
            if (this.isPaused || this.isGameOver || this.isCollisionPaused) {
                this.isAnimating = false;
                return;
            }

            // Controlar movimiento vertical
            if (this.keys.w) {
                this.balloon.translateY(this.verticalSpeed);
                this.display.updateHeight(Math.round(this.balloon.position.y));
            }
            if (this.keys.s) {
                this.balloon.translateY(-this.verticalSpeed);
                this.display.updateHeight(Math.round(this.balloon.position.y));
            }

            // Obtener la dirección del viento
            const windDirection = this.getWindDirection();

            if (windDirection === 'west') {
                this.horizontalSpeed = 0.008;
                this.display.updateAirLayer('West');
                this.balloon.translateX(-this.horizontalSpeed);
                this.balloon.rotation.y -= 0.0017;
            } else if (windDirection === 'east') {
                this.horizontalSpeed = 0.008;
                this.display.updateAirLayer('East');
                this.balloon.translateX(this.horizontalSpeed);
                this.balloon.rotation.y += 0.0017;
            } else if (windDirection === 'south') {
                this.horizontalSpeed = 0.01;
                this.display.updateAirLayer('South');
                this.balloon.translateZ(-this.horizontalSpeed);
            } else if (windDirection === 'north') {
                this.horizontalSpeed = 0.05;
                this.display.updateAirLayer('North');
                this.balloon.translateZ(this.horizontalSpeed);
            } else if (windDirection === 'none') {
                this.display.updateAirLayer('No wind');
            }

            // Check for collisions
            this.checkCollisions();
            // Check for crossing the finish line
            this.checkLineCrossing();
            // Check if the balloon goes out of bounds (using the track bounding box)
            this.checkOutOfBounds();

            this.animationId = requestAnimationFrame(update);
        };

        update();
    }
}

export default MyBalloonController;
