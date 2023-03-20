import {
    AssetsManager,
    Color3,
    Color4,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    Vector3,
} from "babylonjs";
import AssetTasksManager from "./AssetTasksManager";
import king from "./king";
import Camera from "./Camera";
import PlayerChar from "./PlayerChar";
// This loads the GLTF loader that is required to load glb assets
import "babylonjs-loaders";
import { Mesh } from "babylonjs/Meshes/mesh";
import LootBox from "./LootBox";
import { getMeshGroupByName } from "./utils/utils";
import gsap from "gsap";

// Class for game logic
export default class Game {
    private engine: Engine;
    private scene: Scene;

    private assetBaseUrl: string;
    private assetTasks!: AssetTasksManager;

    constructor(canvas: HTMLCanvasElement, assetBaseUrl: string) {
        // Initialise the canvas and engine
        this.engine = new Engine(
            canvas,
            true,
            { preserveDrawingBuffer: true, stencil: true },
            true
        ); // Generate the BabylonJS 3D engine

        /* By default the resolution of the canvas is scaled up by 0.5, this is not needed for this
        project as performance can take a massive hit without much benefit to the visual quality */
        this.engine.setHardwareScalingLevel(1);

        // Initialise states
        this.assetBaseUrl = assetBaseUrl;

        // Removes default BabylonJS loading screen
        SceneLoader.ShowLoadingScreen = true;

        // Initialising the Scene
        this.scene = new Scene(this.engine);

        // TODO: Remove the debug layer code
        this.scene.debugLayer.show();

        this.scene.createDefaultEnvironment({
            createGround: true,
            createSkybox: true,
            toneMappingEnabled: true,
            skyboxColor: Color3.FromHexString("#590000"),
            skyboxSize: 2000,
            groundColor: Color3.FromHexString("#590000"),
            groundSize: 200,
            enableGroundMirror: true,
            // ground
        });

        this.scene.imageProcessingConfiguration.vignetteEnabled = true;
        this.scene.imageProcessingConfiguration.vignetteCameraFov = 0.6;
        this.scene.imageProcessingConfiguration.vignetteWeight = 2.5;

        this.scene.ambientColor = Color3.FromHexString("#000000");
        this.scene.clearColor = Color4.FromHexString("#890000ff");

        this.scene.imageProcessingConfiguration.contrast = 1.3;
        this.scene.imageProcessingConfiguration.exposure = 1.6;
        this.scene.imageProcessingConfiguration.toneMappingEnabled = true;

        //Set gravity for the scene (G force like, on Y-axis)
        this.scene.gravity = new Vector3(0, -0.9, 0);

        // Enable Collisions
        this.scene.collisionsEnabled = true;

        //finally, say which mesh will be collisionable
        this.scene.getMeshByName("BackgroundPlane")!.checkCollisions = true;

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Add camera to the scene
        new Camera(this.scene, canvas);

        this.loadAssets();

        // Watcher for browser/canvas resize events
        window.addEventListener("resize", () => this.engine.resize());
    }

    private loadAssets() {
        // The asset manager loads all of the assets progressively.
        const assetsManager = new AssetsManager(this.scene);
        this.assetTasks = new AssetTasksManager(assetsManager, this.assetBaseUrl);

        // We have our own loading screen so this is not needed - on by default
        assetsManager.useDefaultLoadingScreen = false;
        assetsManager.load();

        assetsManager.onFinish = () => {
            const theKing = new king();
            theKing.build(this.scene);

            // const lootBox = new LootBox();
            // lootBox.build(this.scene);

            getMeshGroupByName("boxBottom", this.scene, (mesh) => {
                mesh.position.y = 1;
            });

            getMeshGroupByName("boxTop", this.scene, (mesh) => {
                mesh.position = new Vector3(0, 1, 0);
                // gsap.to(mesh.position, 1, {
                //     ease: Sine.easeOut,
                //     x: 0.1,
                //     y: 0,
                //     b: 0,
                // });
            });

            this.handleGameLoadComplete();
        };
    }

    // Handles running the scene optimiser, registers running the render loop, and dispatches game complete action
    private handleGameLoadComplete() {
        // Our built-in 'sphere' shape.
        const sphere = MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            this.scene
        );
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        sphere.position.x = 5;

        sphere.checkCollisions = true;

        // const playerChar = new PlayerChar(this.scene);
        // playerChar.position.x =  new Vector3(0, 1, 0);

        // Registers a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => this.scene.render());

        this.scene.render();
    }
}
