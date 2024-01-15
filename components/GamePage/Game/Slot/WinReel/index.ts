import { Color3, Mesh, MeshBuilder, PBRMaterial, Scene, Texture, Vector4 } from "babylonjs";
import gsap from "gsap";
import Slot from "../";

// TODO: Put this in a symbols util
const buildFace = (column = 0, row = 0) => {
    const xTiles = 4;
    const yTiles = 3;
    return new Vector4(
        column * (1 / yTiles),
        row * (1 / xTiles),
        (column + 1) * (1 / yTiles),
        (row + 1) * (1 / xTiles),
    );
};

const gold = buildFace(0, 0);
const cherry = buildFace(0, 1);
const bell = buildFace(0, 2);
const melon = buildFace(0, 3);
const grape = buildFace(1, 0);
const seven = buildFace(1, 1);
const plum = buildFace(1, 2);
const orange = buildFace(1, 3);

const winW = buildFace(2, 3);
const winI = buildFace(2, 2);
const winN = buildFace(2, 1);

const symbols = [gold, grape, cherry, seven, bell, plum, melon, orange];

const getRandomSymbolUV = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
};

// Class to generate individual win reels, this is what is used to signify a winning player
export default class WinReel {
    private cylinders: Mesh[] = [];
    private reelPosition: "left" | "middle" | "right";
    private hasWon: boolean;

    constructor(
        scene: Scene,
        reelLocation = Slot.globalWinReelWidth,
        winReeltexture: Texture,
        winReelNormaltexture: Texture,
        reelPosition: "left" | "middle" | "right" = "left",
        hasWon: boolean,
    ) {
        const reelWidth = Slot.globalWinReelWidth;
        const diameter = Slot.globalReelDiameter;
        const segments = Slot.globalReelSegments;
        const materials = [];

        if (reelPosition !== "left" && reelPosition !== "middle" && reelPosition !== "right") {
            console.error("Reel position name assigned out of scope");
        }

        this.hasWon = hasWon;
        this.reelPosition = reelPosition;

        const innerReelMaterial = new PBRMaterial(`${this.reelPosition}_reel_inner`, scene);
        innerReelMaterial.backFaceCulling = false;
        innerReelMaterial.roughness = 0;
        innerReelMaterial.metallic = 0.15;
        innerReelMaterial.albedoColor = Color3.FromHexString("#000000");

        for (let i = 0; i < segments; i++) {
            const symbolsMaterial = new PBRMaterial(
                `${this.reelPosition}_reel_symbol_${i + 1}`,
                scene,
            );

            symbolsMaterial.albedoColor = new Color3(1, 1, 1);
            symbolsMaterial.albedoTexture = winReeltexture.clone();

            // Blend mode alpha blend is used to remove alpha'd gaps in some symbols left by cutting textures
            symbolsMaterial.transparencyMode = 3;
            symbolsMaterial.useAlphaFromAlbedoTexture = true;
            symbolsMaterial.albedoTexture.hasAlpha = true;

            symbolsMaterial.bumpTexture = winReelNormaltexture.clone();
            symbolsMaterial.bumpTexture.level = 0.05;
            symbolsMaterial.metallic = 0;
            symbolsMaterial.roughness = 0;
            symbolsMaterial.indexOfRefraction = 1.4;

            materials.push(symbolsMaterial);
        }

        const reelParent = MeshBuilder.CreateCylinder(
            `${this.reelPosition}_reel`,
            {
                height: reelWidth,
                diameter: diameter,
                arc: 0.0,
            },
            scene,
        );
        reelParent.isVisible = false;
        reelParent.rotation.y = Math.PI / 2;
        reelParent.rotation.z = Math.PI / 4;
        reelParent.position.y = Slot.globalReelPositionY;
        reelParent.position.z = Slot.globalReelPositionz;
        reelParent.position.x = reelLocation - 0.03;

        const reelBackgroundMaterial = new PBRMaterial(
            `${this.reelPosition}_reel_background`,
            scene,
        );
        reelBackgroundMaterial.albedoColor = new Color3(1, 1, 1);
        reelBackgroundMaterial.backFaceCulling = false;
        reelBackgroundMaterial.roughness = 0.1;
        reelBackgroundMaterial.metallic = 0.05;

        const reelBackground = MeshBuilder.CreateCylinder(
            `${this.reelPosition}_reel_background`,
            {
                height: reelWidth,
                diameter: diameter - 0.01,
                arc: 0.0,
            },
            scene,
        );
        reelBackground.material = reelBackgroundMaterial;
        reelBackground.rotation.x = Math.PI / 2;
        reelBackground.parent = reelParent;

        const innerReel = MeshBuilder.CreateCylinder(
            `${this.reelPosition}_inner_reel`,
            {
                height: reelWidth + 0.07,
                diameter: diameter - 0.05,
                arc: 0.0,
            },
            scene,
        );
        innerReel.material = innerReelMaterial;
        innerReel.rotation.x = Math.PI / 2;

        innerReel.parent = reelParent;

        // todo make this into a seperate segments class
        // This builds the symbols onto segments of the reel
        for (let i = 0; i < segments; i++) {
            const cylinder = MeshBuilder.CreateCylinder(
                `${this.reelPosition}_segment_${i + 1}`,
                {
                    height: reelWidth,
                    // The first and last item in the array is not needed as they are cylinder
                    // caps and can be left as undefined. We need the second Item in the array which
                    // the tubular surface
                    faceUV: [undefined, buildFace(0, 0)] as Vector4[],
                    diameter: diameter,
                    arc: 1 / segments,
                    cap: Mesh.NO_CAP,
                },
                scene,
            );
            cylinder.material = materials[i];

            const newTexture = (cylinder.material as PBRMaterial).albedoTexture as Texture;
            const newNormalTexture = (cylinder.material as PBRMaterial).bumpTexture as Texture;
            const symbol = getRandomSymbolUV();
            newTexture.uOffset = symbol.x;

            newTexture.vOffset = symbol.y;

            newNormalTexture.uOffset = symbol.x;

            newNormalTexture.vOffset = symbol.y;

            cylinder.rotation.y = ((Math.PI * 2) / segments) * i;
            cylinder.parent = reelBackground;
            this.cylinders.push(cylinder);

            (cylinder as any).hasDisplayed = false;
        }
    }

    // Called on button click
    public spin() {
        const numberOfRotations = 15;
        let delay = 0;
        if (this.reelPosition == "left") {
            delay = 0;
        }
        if (this.reelPosition == "middle") {
            delay = 0.75;
        }
        if (this.reelPosition == "right") {
            delay = 1.5;
        }

        return gsap.to(
            this.cylinders.map((mesh) => mesh.rotation),
            9,

            {
                delay: delay,
                y: `+= ${Math.PI * 2 * numberOfRotations + Math.PI / 2}`,
                ease: "back.inOut(0.8)",

                onUpdate: () => {
                    this.cylinders.forEach((segment) => {
                        const spinCount = Math.floor(segment.rotation.y / (Math.PI * 2));
                        const currentRotation = (segment.rotation.y % Math.PI) * 2;

                        if (currentRotation > Math.PI / 4 && spinCount <= numberOfRotations) {
                            (segment as any).hasDisplayed = true;
                        } else if (
                            (segment as any).hasDisplayed == true &&
                            segment.name.match(/_segment_1/)
                        ) {
                            let symbol = getRandomSymbolUV();

                            if (spinCount == numberOfRotations && segment.name.match(/segment_1/)) {
                                if (this.reelPosition === "left") {
                                    symbol = winW;
                                } else if (this.reelPosition === "middle") {
                                    symbol = winI;
                                } else if (this.reelPosition === "right" && this.hasWon) {
                                    symbol = winN;
                                    // This would be where modifiers are applied - transisitions triggered
                                    // randomly transforming from a losing symbol to a winning one.
                                    // This was deemed out of scope for this project.
                                } else {
                                    symbol = getRandomSymbolUV();
                                }
                            }

                            ((segment.material as PBRMaterial).albedoTexture as Texture).uOffset =
                                symbol.x;
                            ((segment.material as PBRMaterial).albedoTexture as Texture).vOffset =
                                symbol.y;

                            ((segment.material as PBRMaterial).bumpTexture as Texture).uOffset =
                                symbol.x;
                            ((segment.material as PBRMaterial).bumpTexture as Texture).vOffset =
                                symbol.y;

                            (segment as any).hasDisplayed = false;
                        }
                    });
                },
            },
        );
    }
}
