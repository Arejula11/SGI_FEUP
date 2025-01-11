import * as THREE from 'three';
import { createPointLight, createSpotLight, createDirectionalLight } from './light.js';

class Graph {
    constructor(graphData, materials) {
        this.graphData = graphData;
        this.materials = materials;
        this.nodes = {};
        this.scene = null;
        console.log("Graph created.", this.graphData);
    }

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

    createNode(nodeId, inheritedMaterial, inheritedTransforms) {
        const nodeData = this.graphData[nodeId];
        if (!nodeData) {
            console.error(`Node data for node "${nodeId}" not found.`);
            return null;
        }
        const group = new THREE.Group();

        let transforms = nodeData.transforms || inheritedTransforms || null;
        if (transforms) {
            this.applyTransforms(group, nodeData.transforms);
        }

        let material = null;
        if (nodeData.materialref) {
            material = nodeData.materialref;
            if (!material) {
                console.warn(`Material "${nodeData.materialref}" not found for node "${nodeId}".`);
            }
        } else if (inheritedMaterial) {
            material = inheritedMaterial;
        }

        if (nodeData.children?.nodesList) {
            nodeData.children.nodesList.forEach((childId) => {
                const childNode = this.createNode(childId, material,transforms);
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
                    primitive = this.createBoxBuffer(childData, material);
                } else if (childData.type === 'cylinder') {
                    primitive = this.createCylinderBuffer(childData, material);
                } else if (childData.type === 'rectangle') {
                    primitive = this.createRectangleBuffer(childData, material);
                } else if (childData.type === 'circle') { 
                    primitive = this.createCircleBuffer(childData, material);
                } else if (childData.type === 'cone') { 
                    primitive = this.createConeBuffer(childData, material);
                }else if (childData.type === 'sphere') {
                    primitive = this.createSphereBuffer(childData, material);
                }else if (childData.type === 'pointlight') {
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

    createBoxBuffer(childData, materialKey) {
        const x1 = childData.xyz1.x;
        const y1 = childData.xyz1.y;
        const z1 = childData.xyz1.z;
        const x2 = childData.xyz2.x;
        const y2 = childData.xyz2.y;
        const z2 = childData.xyz2.z;
    
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const centerZ = (z1 + z2) / 2;
    
        const vertices = new Float32Array([
            // Frente
            x1 - centerX, y1 - centerY, z2 - centerZ,
            x2 - centerX, y1 - centerY, z2 - centerZ,
            x2 - centerX, y2 - centerY, z2 - centerZ,
            x1 - centerX, y2 - centerY, z2 - centerZ,
    
            // Trás
            x1 - centerX, y1 - centerY, z1 - centerZ,
            x1 - centerX, y2 - centerY, z1 - centerZ,
            x2 - centerX, y2 - centerY, z1 - centerZ,
            x2 - centerX, y1 - centerY, z1 - centerZ,
    
            // Topo
            x1 - centerX, y2 - centerY, z1 - centerZ,
            x1 - centerX, y2 - centerY, z2 - centerZ,
            x2 - centerX, y2 - centerY, z2 - centerZ,
            x2 - centerX, y2 - centerY, z1 - centerZ,
    
            // Base
            x1 - centerX, y1 - centerY, z1 - centerZ,
            x2 - centerX, y1 - centerY, z1 - centerZ,
            x2 - centerX, y1 - centerY, z2 - centerZ,
            x1 - centerX, y1 - centerY, z2 - centerZ,
    
            // Direita
            x2 - centerX, y1 - centerY, z1 - centerZ,
            x2 - centerX, y2 - centerY, z1 - centerZ,
            x2 - centerX, y2 - centerY, z2 - centerZ,
            x2 - centerX, y1 - centerY, z2 - centerZ,
    
            // Esquerda
            x1 - centerX, y1 - centerY, z1 - centerZ,
            x1 - centerX, y1 - centerY, z2 - centerZ,
            x1 - centerX, y2 - centerY, z2 - centerZ,
            x1 - centerX, y2 - centerY, z1 - centerZ,
        ]);
    
        const indices = [
            0, 1, 2, 0, 2, 3, // Frente
            4, 5, 6, 4, 6, 7, // Trás
            8, 9, 10, 8, 10, 11, // Topo
            12, 13, 14, 12, 14, 15, // Base
            16, 17, 18, 16, 18, 19, // Direita
            20, 21, 22, 20, 22, 23, // Esquerda
        ];
    
        const uvs = new Float32Array([
            // Frente
            0, 0, 1, 0, 1, 1, 0, 1,
    
            // Trás
            0, 0, 0, 1, 1, 1, 1, 0,
    
            // Topo
            0, 0, 0, 1, 1, 1, 1, 0,
    
            // Base
            0, 0, 1, 0, 1, 1, 0, 1,
    
            // Direita
            0, 0, 1, 0, 1, 1, 0, 1,
    
            // Esquerda
            0, 0, 0, 1, 1, 1, 1, 0,
        ]);
    
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // Adicionando as coordenadas UV
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
    
        const material = this.materials.getMaterial(materialKey);
        return new THREE.Mesh(geometry, material);
    }
    
    createCylinderBuffer(childData, materialKey) {
        const baseRadius = childData.base;
        const topRadius = childData.top;
        const height = childData.height;
        const radialSegments = childData.slices;
        const heightSegments = childData.stacks;
        const capsclose = childData.capsclose;
    
        const vertices = [];
        const indices = [];
        const normals = [];
        const uvs = [];
    
        const angleStep = (Math.PI * 2) / radialSegments;
    
        // Gerar vértices e normais para o corpo do cilindro
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const radius = baseRadius + (topRadius - baseRadius) * v;
            const yPos = height / 2 - v * height;
    
            for (let i = 0; i <= radialSegments; i++) {
                const angle = i * angleStep;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
    
                vertices.push(x, yPos, z);
    
                // Normais
                const normalX = Math.cos(angle);
                const normalZ = Math.sin(angle);
                normals.push(normalX, 0, normalZ);
    
                // UVs
                uvs.push(i / radialSegments, v);
            }
        }
    
        // Gerar índices para o corpo do cilindro
        for (let y = 0; y < heightSegments; y++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = y * (radialSegments + 1) + i;
                const b = a + radialSegments + 1;
                const c = a + 1;
                const d = b + 1;
    
                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }
    
        // Gerar tampas (base e topo) se capsclose for true
        if (!capsclose) {
            const generateCap = (isTop) => {
                const yPos = isTop ? height / 2 : -height / 2;
                const radius = isTop ? topRadius : baseRadius;
    
                const centerIndex = vertices.length / 3; // Índice do centro da tampa
                vertices.push(0, yPos, 0); // Centro
                normals.push(0, isTop ? 1 : -1, 0); // Normal do centro
                uvs.push(0.5, 0.5); // UV do centro
    
                for (let i = 0; i <= radialSegments; i++) {
                    const angle = i * angleStep;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
    
                    vertices.push(x, yPos, z);
                    normals.push(0, isTop ? 1 : -1, 0);
                    uvs.push((x / radius + 1) / 2, (z / radius + 1) / 2);
    
                    if (i < radialSegments) {
                        const nextIndex = centerIndex + i + 1;
                        if (isTop) {
                            indices.push(centerIndex, nextIndex, nextIndex + 1);
                        } else {
                            indices.push(centerIndex, nextIndex + 1, nextIndex);
                        }
                    }
                }
            };
    
            // Base inferior
            generateCap(false);
    
            // Base superior
            generateCap(true);
        }
    
        // Criar BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);
    
        // Obter material
        const material = this.materials.getMaterial(materialKey);
        material.side = THREE.DoubleSide; // Renderizar ambos os lados
    
        return new THREE.Mesh(geometry, material);
    }
    
    
    createRectangleBuffer(childData, materialKey) {
        // Calculando o centro do retângulo
        const centerX = (childData.xy1.x + childData.xy2.x) / 2;
        const centerY = (childData.xy1.y + childData.xy2.y) / 2;
    
        // Definindo os vértices do retângulo em relação ao centro
        const vertices = new Float32Array([
            childData.xy1.x - centerX, childData.xy1.y - centerY, 0, // Vértice 1
            childData.xy2.x - centerX, childData.xy1.y - centerY, 0, // Vértice 2
            childData.xy2.x - centerX, childData.xy2.y - centerY, 0, // Vértice 3
            childData.xy1.x - centerX, childData.xy2.y - centerY, 0  // Vértice 4
        ]);
    
        // Adicionando as coordenadas UV para mapeamento da textura
        const uvs = new Float32Array([
            0, 0, // Vértice 1
            1, 0, // Vértice 2
            1, 1, // Vértice 3
            0, 1  // Vértice 4
        ]);
    
        // Definindo os índices dos triângulos que formam o retângulo
        const indices = [
            0, 1, 2, // Primeiro triângulo (V1 -> V2 -> V3)
            0, 2, 3  // Segundo triângulo (V1 -> V3 -> V4)
        ];
    
        // Criando a geometria com os vértices, índices e UVs
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // Adicionando as coordenadas UV
        geometry.setIndex(indices);
    
        // Calculando as normais da superfície para iluminação
        geometry.computeVertexNormals();
    
        // Obtendo o material
        const material = this.materials.getMaterial(materialKey);
    
        // Retornando a malha do retângulo
        return new THREE.Mesh(geometry, material);
    }

    createCircleBuffer(childData, materialKey) {
        const radius = childData.radius;
        const segments = childData.segments || 32; // Número de segmentos no círculo
        const startAngle = childData.startAngle || 0; // Ângulo inicial
        const angleLength = childData.angleLength || Math.PI * 2; // Comprimento do ângulo em radianos
    
        const vertices = [];
        const indices = [];
        const uvs = [];
    
        // Adiciona o centro do círculo
        vertices.push(0, 0, 0); // Posição
        uvs.push(0.5, 0.5); // UV do centro
    
        // Adiciona os vértices ao redor da borda
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i / segments) * angleLength;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
    
            vertices.push(x, y, 0); // Posição
            uvs.push((x / (2 * radius)) + 0.5, (y / (2 * radius)) + 0.5); // UV
        }
    
        // Adiciona os índices para formar triângulos entre o centro e a borda
        for (let i = 1; i <= segments; i++) {
            indices.push(0, i, i + 1);
        }
    
        // Criar BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);
    
        // Obter material
        const material = this.materials.getMaterial(materialKey);
    
        // Retornar Mesh
        return new THREE.Mesh(geometry, material);
    }

    createConeBuffer(childData, materialKey) {
        const baseRadius = childData.base;
        const height = childData.height;
        const radialSegments = childData.slices;
        const heightSegments = childData.stacks;
        const openEnded = !childData.capsclose; // Define se a base é aberta ou fechada
    
        const vertices = [];
        const indices = [];
        const normals = [];
        const uvs = [];
    
        const angleStep = (Math.PI * 2) / radialSegments;
    
        // Gerar vértices para o corpo do cone
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const radius = baseRadius * (1 - v); // Interpolação linear para o topo
            const yPos = -height / 2 + v * height; // Altura correspondente, corrigindo a direção do eixo Y
    
            for (let i = 0; i <= radialSegments; i++) {
                const angle = i * angleStep;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
    
                vertices.push(x, yPos, z);
    
                // Calcular normais
                const normalX = x;
                const normalY = baseRadius / height; // Inclinação normal do cone
                const normalZ = z;
                const length = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
    
                normals.push(normalX / length, normalY / length, normalZ / length);
    
                // UVs para o corpo
                const u = i / radialSegments;
                uvs.push(u, v);
            }
        }
    
        // Gerar índices para os triângulos do corpo
        for (let y = 0; y < heightSegments; y++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = y * (radialSegments + 1) + i;
                const b = a + radialSegments + 1;
                const c = a + 1;
                const d = b + 1;
    
                // Primeiro triângulo
                indices.push(a, b, d);
                // Segundo triângulo
                indices.push(a, d, c);
            }
        }
    
        // Gerar vértices, normais e UVs para a base (se necessário)
        if (!openEnded) {
            const baseIndex = vertices.length / 3; // Índice inicial da base
            vertices.push(0, -height / 2, 0); // Centro da base
            normals.push(0, -1, 0); // Normal para baixo
            uvs.push(0.5, 0.5); // Centro da base em UV
    
            for (let i = 0; i <= radialSegments; i++) {
                const angle = i * angleStep;
                const x = Math.cos(angle) * baseRadius;
                const z = Math.sin(angle) * baseRadius;
    
                vertices.push(x, -height / 2, z);
                normals.push(0, -1, 0);
                uvs.push((x / baseRadius + 1) / 2, (z / baseRadius + 1) / 2);
            }
    
            for (let i = 0; i < radialSegments; i++) {
                indices.push(baseIndex, baseIndex + i + 1, baseIndex + i + 2);
            }
        }
    
        // Criar BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);
    
        // Obter material
        const material = this.materials.getMaterial(materialKey);
    
        // Retornar Mesh
        return new THREE.Mesh(geometry, material);
    }
    
    
    createSphereBuffer(childData, materialKey) {
        const radius = childData.radius;
        const widthSegments = childData.slices;
        const heightSegments = childData.stacks;
        const thetaStart = childData.thetastart || 0;
        const thetaLength = childData.thetalength || Math.PI * 2;
        const phiStart = childData.phistart || 0;
        const phiLength = childData.philength || Math.PI;
    
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];
    
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const phi = phiStart + v * phiLength;
    
            for (let x = 0; x <= widthSegments; x++) {
                const u = x / widthSegments;
                const theta = thetaStart + u * thetaLength;
    
                const vx = -radius * Math.cos(theta) * Math.sin(phi);
                const vy = radius * Math.cos(phi);
                const vz = radius * Math.sin(theta) * Math.sin(phi);
    
                vertices.push(vx, vy, vz);
                normals.push(vx / radius, vy / radius, vz / radius);
                uvs.push(u, v);
            }
        }
    
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = y * (widthSegments + 1) + x;
                const b = a + widthSegments + 1;
                const c = b + 1;
                const d = a + 1;
    
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
    
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);
    
        const material = this.materials.getMaterial(materialKey);
    
        return new THREE.Mesh(geometry, material);
    }    
    
    
}

export default Graph;
