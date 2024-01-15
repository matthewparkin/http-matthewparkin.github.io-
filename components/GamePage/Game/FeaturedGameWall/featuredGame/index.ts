// Constants
import { MeshBuilder, PBRMaterial, Scene, Texture, Vector3 } from "babylonjs";

import gsap, { Sine } from "gsap";

export default class FeaturedGame {
    position: Vector3;
    constructor(scene: Scene, gameTileTexture: Texture, gameTileURl: string, position: Vector3) {
        this.position = position;
        const featuredGameCubeMaterial = new PBRMaterial(gameTileURl, scene);
        const texture = gameTileTexture;
        featuredGameCubeMaterial.albedoTexture = texture;
        featuredGameCubeMaterial.metallic = 1;
        featuredGameCubeMaterial.alpha = 0;

        const options = {
            wrap: true,
        };

        //  The featured game cube is a box that has image tiles of a game on site. This is intended
        // to be clicked on and sends a redirect action to the correct game url that is passed in.
        const featuredGameCube = MeshBuilder.CreateBox(gameTileURl, options);
        featuredGameCube.material = featuredGameCubeMaterial;

        // metadata is the identifier assigned to a mesh, where the picker ray uses it to identify
        // where to redirect
        featuredGameCube.metadata = gameTileURl;

        featuredGameCube.position = this.position;
        featuredGameCube.rotation = new Vector3(0, Math.PI - 0.1, 0);

        // This animation fades in the cube
        gsap.to(featuredGameCubeMaterial, 1, {
            ease: Sine.easeOut,
            alpha: 1,
        });

        // This animation rotates the cube inifinitely
        gsap.to(featuredGameCube.rotation, 20, {
            ease: Sine.easeOut,
            repeat: -1,
            y: Math.PI * 2,
            yoyo: true,
        });
    }
}
