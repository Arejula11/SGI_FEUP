import * as THREE from 'three';

class TextManager {
    constructor(scene) {
        this.scene = scene; // A cena onde os textos serão adicionados
    }

    /**
     * Adiciona texto à cena
     * @param {string} text - O texto a ser exibido
     * @param {number} x - Posição X do texto
     * @param {number} y - Posição Y do texto
     * @param {number} z - Posição Z do texto
     * @param {number} fontSize - Tamanho da fonte
     * @param {string} name - Nome opcional para identificar o texto
     */
    addTextToScene(text, x, y, z, fontSize, name = null) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('scenes/main/textures/spritesheet.png'); // Carregar a spritesheet
    
        const group = new THREE.Group(); // Grupo para organizar os caracteres
        const charWidth = 1 / 16; // Largura de cada caractere na spritesheet
        const charHeight = 1 / 16; // Altura de cada caractere na spritesheet
    
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i); // Código ASCII do caractere
            const u = (char % 16) * charWidth;
            const v = 1 - Math.floor(char / 16) * charHeight;
    
            const geometry = new THREE.PlaneGeometry(fontSize, fontSize); // Define o tamanho do caractere
    
            // Criar um material único para cada caractere
            const material = new THREE.MeshBasicMaterial({
                map: texture.clone(), // Clonar a textura para cada caractere
                transparent: true,
            });
    
            // Configurar as coordenadas UV para o caractere
            material.map.offset.set(u, v - charHeight); // Ajuste UV inicial
            material.map.repeat.set(charWidth, charHeight); // Ajuste UV de tamanho
            material.map.needsUpdate = true;
    
            const charMesh = new THREE.Mesh(geometry, material);
            charMesh.position.set(i * fontSize * 1.2, 0, 0); // Espaçamento entre os caracteres
            group.add(charMesh);
        }
    
        group.position.set(x - (text.length * fontSize * 0.6), y, z); // Centralizar o texto no eixo X

        if (name) {
            group.name = name; // Nomear o grupo, se fornecido
        }

        this.scene.add(group);
    }

    /**
     * Remove texto da cena pelo nome
     * @param {string} name - Nome do texto a ser removido
     */
    removeTextFromScene(name) {
        const textGroup = this.scene.getObjectByName(name);
        if (textGroup) {
            this.scene.remove(textGroup); // Remove o grupo da cena
            console.log(`Texto "${name}" removido da cena.`);
        } else {
            console.warn(`Texto "${name}" não encontrado na cena.`);
        }
    }
}

export default TextManager;