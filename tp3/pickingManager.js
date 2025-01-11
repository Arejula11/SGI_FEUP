import * as THREE from 'three';
import TextManager from './textManager.js';
import MyBalloonController from './src/MyBalloonController.js';

class PickingManager {
    constructor(scene, camera, interactiveObjects, transitionCallback, display, app) {
        this.scene = scene; 
        this.camera = camera; 
        this.interactiveObjects = interactiveObjects; 
        this.raycaster = new THREE.Raycaster(); 
        this.mouse = new THREE.Vector2(); 
        this.transitionCallback = transitionCallback;
        this.textManager = null;
        this.display = display;
        this.app = app;
        this.selectedBalloon = null; 
        this.spaceNameClicked = false;
        this.typedName = '';  

        window.addEventListener('click', this.onMouseClick.bind(this), false);
    }

    /*
    * Method to manage the mouse click event
    */
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);
    
        if (intersects.length > 0) {
            let selectedObject = intersects[0].object;
    
            while (selectedObject && !selectedObject.name) {
                selectedObject = selectedObject.parent;
            }
    
            if (selectedObject) {
                // console.log(`Objeto selecionado: ${selectedObject.name}`);
                this.executeAction(selectedObject);
            } else {
                console.warn("Nenhum objeto clicável identificado.");
            }
        }
    }

    /*
    * Method to execute the action based on the object clicked
    */
    executeAction(object) {
        // console.log(object);
        switch (object.name) {
            case 'startButton':
                // console.log('Botão de início pressionado!');
                this.startGame();
                break;
    
            case 'balloon1':
                // console.log('Balão 1 selecionado!');
                this.selectedBalloon = object.name; 
                this.resizeBalloons(object.name);
                break;

            case 'balloon2':
                // console.log('Balão 2 selecionado!');
                this.selectedBalloon = object.name; 
                this.resizeBalloons(object.name);
                break;

            case 'spaceName':
                // console.log('Space Name clicked!');
                this.spaceNameClicked = true; 
                this.promptForName(object);
                break;
            case 'playAgain':
                console.log('Botão "play again" pressionado!');
                this.transitionCallback("scenes/main/scene_game.json");
                break;

            case 'menu':
                console.log('Botão "menu" pressionado!');
                this.transitionCallback("scenes/main/scene_initial.json");
                break;
    
            default:
                console.warn('Objeto não reconhecido.');
                break;
        }
    }
    /*
    * Method to start the game
    */
    async startGame() {
        if (this.selectedBalloon && this.spaceNameClicked) {
            // console.log("Iniciando o jogo...");

            const opponentBalloon = this.selectedBalloon === 'balloon1' ? 'balloon2' : 'balloon1';
            this.display.updateGameStatus("Running");
            // console.log(`Balão selecionado: ${this.selectedBalloon}`);
            // console.log(`Balão do oponente: ${opponentBalloon}`);

            this.transitionCallback("scenes/main/scene_game.json", opponentBalloon);

            await new Promise(resolve => setTimeout(resolve, 1000));
            const opponentBalloonObject = this.scene.getObjectByName(opponentBalloon);
            const selectedBalloonObject = this.scene.getObjectByName(this.selectedBalloon);
            if( this.typedName === 'a' || this.typedName === 'A'){
                //set the position of the balloon
                selectedBalloonObject.position.set(-18, 5, -35);
                opponentBalloonObject.position.set(-25, 5, -35);
            }else if( this.typedName === 'b' || this.typedName === 'B'){
                //set the position of the balloon
                selectedBalloonObject.position.set(-25, 5, -35);
                opponentBalloonObject.position.set(-18, 5, -35);
            }
            // this.transitionCallback("scenes/main/scene_game.json", this.selectedBalloon);
            this.app.setActiveCamera('gameCam')
            this.display.updatePosition(this.typedName)
            this.app.followObjectThreePerson(this.selectedBalloon)
            // Crear una instancia de la clase y usarla
            const myBalloonController = new MyBalloonController(this.scene, this.selectedBalloon, this.display, this.app);

        } else {
            console.warn(
                "Não é possível iniciar o jogo. Certifique-se de selecionar um balão e clicar no espaço de nome."
            );
            if (!this.selectedBalloon) {
                console.warn("Nenhum balão foi selecionado.");
            }
            if (!this.spaceNameClicked) {
                console.warn("O espaço de nome não foi clicado.");
            }
        }
    }

    /*
    * Method to resize the balloons
    */
    resizeBalloons(selectedBalloonName) {
        const balloon1 = this.scene.getObjectByName('balloon1');
        const balloon2 = this.scene.getObjectByName('balloon2');
    
        if (!balloon1 || !balloon2) {
            console.warn('Não foi possível encontrar os balões.');
            return;
        }
    
        // Define os tamanhos com base no balão selecionado
        if (selectedBalloonName === 'balloon1') {
            balloon1.scale.set(11, 11, 11); 
            balloon2.scale.set(8, 8, 8); 
        } else if (selectedBalloonName === 'balloon2') {
            balloon2.scale.set(11, 11, 11); 
            balloon1.scale.set(8, 8, 8); 
        }
    
        // console.log(`${selectedBalloonName} redimensionado!`);
    }

    /*
    * Method to prompt for the name
    */
    promptForName(object) {    
        const placeholderText = this.scene.getObjectByName('placeholderText');
        if (placeholderText) {
            // console.log("Texto inicial localizado, pronto para ser removido.");
        } else {
            console.warn("Texto inicial não encontrado.");
        }

        const onKeyPress = (event) => {
            if (event.key === 'Enter') {
                
                this.displayTypedName(this.typedName, placeholderText); 
                window.removeEventListener('keydown', onKeyPress); 
            } else if (event.key === 'Backspace') {
                this.typedName = this.typedName.slice(0, -1);
            } else if (event.key.length === 1) {
                this.typedName += event.key;
            }
            
        };
    
        window.addEventListener('keydown', onKeyPress);
    }

    /*
    * Method to display the typed name
    */
    displayTypedName(name, placeholderText) {
        if (this.scene && this.textManager) {
            if (placeholderText) {
                this.scene.remove(placeholderText);
                // console.log("Texto inicial removido da cena.");
            }
            this.textManager.addTextToScene(name, 0, 50, 91, 3.5); 
        } else {
            console.error('Scene ou TextManager não configurado.');
        }
    }
    
}

export default PickingManager;