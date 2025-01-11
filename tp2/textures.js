import * as THREE from 'three';

class Textures {
    constructor(textureData) {
        this.textureData = textureData; // Dados das texturas fornecidos no JSON
        this.textures = {}; // Objeto para armazenar texturas carregadas
    }

    // Configura as texturas usando TextureLoader
    setup() {
        const textureLoader = new THREE.TextureLoader();

        for (let key in this.textureData) {
            const texInfo = this.textureData[key];
            // console.log(texInfo);
            // Verifica se é uma textura de vídeo
            if (texInfo.isVideo) {
                // Cria um vídeo e armazena a textura
                const video = document.createElement('video');
                video.src = texInfo.filepath;
                video.load();
                document.addEventListener('click', () => {
                    video.play()
                        .then(() => {

                        })
                        .catch((error) => {
                            console.error("Error playing video:", error);
                        });
                }, { once: true }); // Event listener is removed after the first click
                
                video.play();
                const texture = new THREE.VideoTexture(video);
                this.textures[key] = texture;
            }else if (texInfo.mipmap0) {
                // Configuração manual de mipmaps
                const mipmapLevels = [];
                let level = 0;
                while (texInfo[`mipmap${level}`]) {
                    mipmapLevels.push(texInfo[`mipmap${level}`]);
                    level++;
                }

                const mipmaps = mipmapLevels.map((mipPath) => {
                    const image = new Image();
                    image.src = mipPath;
                    return { image };
                });

                const texture = textureLoader.load(texInfo.filepath);
                texture.mipmaps = mipmaps;
                texture.generateMipmaps = false; 
                this.textures[key] = texture;
            } else {
                const texture = textureLoader.load(texInfo.filepath, (tex) => {
                    tex.generateMipmaps = true; 
                    tex.minFilter = THREE.LinearMipmapLinearFilter; 
                });
                this.textures[key] = texture;

                //texture bump
                if (texInfo.bumpref) {
                    const bumpMap = textureLoader.load(texInfo.bumpref);
                    this.textures[`${key}_bump`] = bumpMap;
                }
            }
        }
        // console.log("textures:",this.textures);
        return this.textures; // Retorna as texturas carregadas
    }

    // Retorna uma textura carregada pelo ID
    getTexture(textureKey) {
        if (this.textures[textureKey]) {
            return this.textures[textureKey];
        } else {
            console.warn(`Texture "${textureKey}" not found.`);
            return null;
        }
    }

    // Retorna uma textura de bump carregada pelo ID
    getBumpTexture(textureKey) {
        const bumpKey = `${textureKey}_bump`;
        if (this.textures[bumpKey]) {
            return this.textures[bumpKey];
        } else {
            console.warn(`Bump map "${bumpKey}" not found.`);
            return null;
        }
    }
}

export default Textures;
