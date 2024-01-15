// Constants
import {
    AbstractMesh,
    Color3,
    GlowLayer,
    Material,
    PBRMaterial,
    Scene,
    Texture,
    Vector3,
} from "babylonjs";

import gsap, { Sine } from "gsap";

export default class MachineBody {
    isMega: boolean;
    neons: Color3;
    bulb!: PBRMaterial;
    glow!: GlowLayer;
    leftCurtainScale!: Vector3;
    rightCurtainScale!: Vector3;
    leftCurtainPosition!: Vector3;
    rightCurtainPosition!: Vector3;

    constructor(isMega: boolean) {
        this.isMega = isMega;
        this.neons = new Color3(0.99, 0.46, 0.46);
        this.leftCurtainScale = new Vector3(0.013, 0.013, 0.015);
        this.rightCurtainScale = new Vector3(0.013, 0.013, 0.015);
        this.leftCurtainPosition = new Vector3(-0.39, 0, -10.15);
        this.rightCurtainPosition = new Vector3(0.905, 0, -10.15);
    }
    // builds a GTLF file which is compressed to Binary - https://www.khronos.org/gltf/
    // This link shows the model is then further compressed using the draco mesh compressor,
    // and shows the model before the below material changes
    // https://gltf.insimo.com/vENvfxesdNiG-GzKJDVQ1FD8eKFPIQTwHomjD6w.0yCN8_RXzHos3VsfJ2McKS472je5gV1TxLFNIw

    public build(
        scene: Scene,
        bodyTexture: Texture,
        bodyNormalTexture: Texture,
        shadowMapTexture: Texture,
        floorTexture: Texture,
        floorNormalTexture: Texture,
        fabricNormalTexture: Texture,
    ) {
        // This function finds a materials name from a GTLF model
        const findMaterialByName = (name: string) => {
            return (mesh: Material) => {
                return mesh.name == name;
            };
        };

        // This function gets a material using the findMaterialByName function and types it as a PBRMaterial
        /* This the uses the callBack function to check if the material exists, else this will
            gracefully error, warning that the material could not be found, this is used as the material
            will not break the functionality of the game, but can affect the look. */
        const getMaterialByName = (name: string, callBack: (material: PBRMaterial) => void) => {
            const material = scene.materials.find(findMaterialByName(name)) as PBRMaterial;
            if (material) {
                callBack(material);
            } else {
                console.warn("unable to find material" + name);
            }
        };

        // Finds a mesh from the gtlf file
        const findByMesh = (id: string) => {
            return (meshes: AbstractMesh) => {
                return meshes.id == id;
            };
        };

        // Callback to return gets mesh name
        const getMeshByName = (name: string, callBack: (mesh: AbstractMesh) => void) => {
            const mesh = scene.meshes.find(findByMesh(name));
            if (mesh) {
                callBack(mesh);
            } else {
                console.warn("unable to find mesh " + name);
            }
        };

        // getMeshByName("curtain_right", (mesh) => {
        //     mesh.scaling = this.rightCurtainScale;
        //     mesh.position = this.rightCurtainPosition;
        // });

        // getMeshByName("curtain_left", (mesh) => {
        //     mesh.scaling = this.leftCurtainScale;
        //     mesh.position = this.leftCurtainPosition;
        // });

        // // Gets the material by name and applys changes to the material such as affecting colour
        // getMaterialByName("neons", (material) => {
        //     material.alpha = 1;

        //     material.clearCoat.isEnabled = true;
        //     material.clearCoat.indexOfRefraction = 3;

        //     // If statement changes the material dependent on if the game is in "mega" state or not
        //     if (this.isMega) {
        //         this.neons = new Color3(0.9, 0, 0);
        //         material.emissiveColor = this.neons;
        //         material.albedoColor = Color3.FromHexString("#000");
        //     } else {
        //         material.albedoColor = Color3.FromHexString("#fff");
        //         material.emissiveColor = this.neons;
        //     }
        // });

        getMaterialByName("chrome", (material) => {
            material.albedoColor = Color3.FromHexString("#551414");
            material.environmentIntensity = 0.5;
            material.clearCoat.isEnabled = true;
        });

        //     getMaterialByName("rigging", (material) => {
        //         material.albedoColor = Color3.FromHexString("#ffa7a7");
        //         material.environmentIntensity = 0.5;
        //         material.clearCoat.isEnabled = true;
        //     });

        //     getMaterialByName("curtain", (material) => {
        //         material.metallic = 1;
        //         fabricNormalTexture.uScale = 2;
        //         fabricNormalTexture.vScale = 2;
        //         material.bumpTexture = fabricNormalTexture;
        //         material.bumpTexture.level = 0.07;
        //         material.roughness = 0.35;
        //         material.metallicF0Factor = 1;
        //         material.albedoColor = Color3.FromHexString("#ff0000");

        //         material.anisotropy.isEnabled = true;
        //         material.anisotropy.intensity = 0.2;
        //     });

        //     getMaterialByName("winner_text", (material) => {
        //         material.metallic = 1;
        //         material.roughness = 0.1;
        //     });

        //     getMaterialByName("floor", (material) => {
        //         floorTexture.uScale = 15;
        //         floorTexture.vScale = 15;
        //         material.albedoTexture = floorTexture;

        //         floorNormalTexture.uScale = 15;
        //         floorNormalTexture.vScale = 15;
        //         material.bumpTexture = floorNormalTexture;
        //         material.bumpTexture.level = 1.2;
        //         material.invertNormalMapX = true;

        //         // Allows baked shadow map to use occlusions instead of behaving like a normal light map
        //         material.useLightmapAsShadowmap = true;

        //         // Texture baked at wrong UV Cordinates. This should usually be done in the model.
        //         // However this demonstrates that it can be adjusted by developers if needed.
        //         shadowMapTexture.uOffset = -0.192;
        //         shadowMapTexture.vOffset = 1.092;
        //         shadowMapTexture.uScale = 1.53;
        //         shadowMapTexture.vScale = 1.31;
        //         material.lightmapTexture = shadowMapTexture;

        //         material.environmentIntensity = 0.6;
        //         material.metallic = 0.9;
        //         material.roughness = 0.73;
        //         material.metallicF0Factor = 0.5;
        //         material.metallicReflectanceColor = Color3.FromHexString("#880000");
        //         material.subSurface.tintColor = Color3.FromHexString("#880000");
        //         material.subSurface.isTranslucencyEnabled = true;
        //         material.sheen.isEnabled = true;
        //         material.sheen.intensity = 0.3;
        //         if (this.isMega) {
        //             material.sheen.color = Color3.FromHexString("#644400");
        //         } else {
        //             material.sheen.color = Color3.FromHexString("#880000");
        //         }
        //     });

        //     getMaterialByName("main_body", (material) => {
        //         // If statement changes the material dependent on if the game is in "mega" state or not
        //         if (this.isMega) {
        //             material.albedoColor = Color3.FromHexString("#FFB100");
        //             material.metallic = 1;
        //             material.roughness = 0.14;
        //             material.metallicF0Factor = 0;
        //             material.enableSpecularAntiAliasing = false;
        //         } else {
        //             material.albedoColor = Color3.FromHexString("#1c0000");
        //             material.roughness = 0.15;
        //         }
        //         material.metallicTexture = bodyTexture;
        //         material.bumpTexture = bodyNormalTexture;
        //         material.clearCoat.isEnabled = true;
        //         material.clearCoat.bumpTexture = bodyNormalTexture;
        //         material.usePhysicalLightFalloff = true;
        //         material.clearCoat.indexOfRefraction = 1.65;
        //         material.clearCoat.roughness = 0.25;
        //     });

        //     getMaterialByName("bulb_on", (material) => {
        //         this.bulb = material;
        //         material.alpha = 0.2;
        //         material.transparencyMode = 2;
        //         material.emissiveColor = Color3.FromHexString("#FEEE5E");
        //         material.albedoColor = Color3.FromHexString("#BABABA");
        //     });

        //     getMaterialByName("text", (material) => {
        //         material.albedoColor = Color3.FromHexString("#0f0f0f");
        //         material.metallic = 1;
        //         material.roughness = 0.4;
        //     });

        //     getMaterialByName("ceiling", (material) => {
        //         material.albedoColor = Color3.FromHexString("#000");
        //         material.bumpTexture = floorNormalTexture;
        //         material.metallic = 0.5;
        //         material.roughness = 0.8;
        //     });

        //     getMaterialByName("marquee", (material) => {
        //         material.metallic = 1;
        //         material.sheen.isEnabled = true;
        //         material.albedoColor = new Color3(4, 4, 4);
        //     });

        //     this.glow = new GlowLayer("glow", scene, {
        //         mainTextureSamples: 2,
        //         blurKernelSize: 32,
        //     });
        //     this.glow.intensity = 1.1;
    }

    // animation quickly flashes bulbs on a win
    public async winAnimation() {
        await gsap.to(this.bulb, {
            ease: Sine.easeInOut,
            alpha: 1,
            yoyo: true,
            repeat: 7,
            duration: 0.5,
        });
    }

    // animation moves curtains and opens them outwards
    public async curtainOpen() {
        gsap.to(this.leftCurtainScale, {
            ease: Sine.easeInOut,
            x: 0.003,
            duration: 1,
        });
        gsap.to(this.rightCurtainScale, {
            ease: Sine.easeInOut,
            x: 0.003,
            duration: 1,
        });
        gsap.to(this.leftCurtainPosition, {
            ease: Sine.easeInOut,
            x: -4.5,
            duration: 1,
        });
        gsap.to(this.rightCurtainPosition, {
            ease: Sine.easeInOut,
            x: 4.5,
            duration: 1,
        });
    }

    // animation slowly pulses glow on winning
    public hasWonAnimate() {
        gsap.to(this.glow, {
            ease: Sine.easeInOut,
            intensity: 2.1,
            yoyo: true,
            repeat: -1,
            duration: 1,
        });
    }

    // animation turns off lights in scene
    public async loseAnimation() {
        await gsap.to(this.neons, 1, {
            ease: Sine.easeOut,
            r: 0.1,
            g: 0,
            b: 0,
        });

        await gsap.to(this.bulb, 1, {
            ease: Sine.easeOut,
            alpha: 0,
        });

        gsap.to(this.glow, 1, {
            ease: Sine.easeOut,
            intensity: 0,
        });
    }
}
