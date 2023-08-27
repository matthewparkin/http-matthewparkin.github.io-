import {
    AssetsManager,
    Color3,
    Color4,
    Engine,
    HardwareScalingOptimization,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    SceneOptimizer,
    SceneOptimizerOptions,
    ScenePerformancePriority,
    Vector3,
} from "babylonjs";
import AssetTasksManager from "./AssetTasksManager";
import Camera from "./Camera";
import "babylonjs-loaders";

// Class for game logic
export default class Game {
    private engine: Engine;
    private scene: Scene;

    private assetBaseUrl: string;
    private assetTasks!: AssetTasksManager;

    private hardwareScalingOptimisation: HardwareScalingOptimization;

    constructor(canvas: HTMLCanvasElement, assetBaseUrl: string, config: {}) {
        // Initialise the canvas and engine
        this.engine = new Engine(
            canvas,
            true,
            { preserveDrawingBuffer: true, stencil: true },
            true,
        ); // Generate the BabylonJS 3D engine

        /* By default the resolution of the canvas is scaled up by 0.5, this is not needed for this
        project as performance can take a massive hit without much benefit to the visual quality */
        this.engine.setHardwareScalingLevel(1);

        this.hardwareScalingOptimisation = new HardwareScalingOptimization(0, 1.5, 0.25);

        // Removes default BabylonJS loading screen
        SceneLoader.ShowLoadingScreen = false;

        // Initialise states
        this.assetBaseUrl = assetBaseUrl;

        // Initialising the Scene
        this.scene = new Scene(this.engine);

        // TODO: Remove the debug layer code before going to production
        this.scene.debugLayer.show();

        this.scene.createDefaultEnvironment({
            createGround: true,
            createSkybox: true,
            toneMappingEnabled: true,
            skyboxColor: Color3.FromHexString("#ececec"),
            skyboxSize: 25000, // Size of the skybox to prevent Z-fighting with the ground
            groundColor: Color3.FromHexString("#FFFFFF"),
            groundSize: 20000,
            groundOpacity: 1,
            enableGroundShadow: true,
        });

        this.scene.imageProcessingConfiguration.vignetteEnabled = true;
        this.scene.imageProcessingConfiguration.vignetteCameraFov = 0.6;
        this.scene.imageProcessingConfiguration.vignetteWeight = 2.5;

        this.scene.ambientColor = Color3.FromHexString("#000000");
        this.scene.clearColor = Color4.FromHexString("#ececec");

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

        assetsManager.useDefaultLoadingScreen = false;
        assetsManager.load();

        assetsManager.onFinish = () => {
            // Builds the machine body asset and changes materials, also adds glow layer to scene
        };

        this.handleGameLoadComplete();
    }

    // Handles running the scene optimiser, registers running the render loop, and dispatches game complete action
    private handleGameLoadComplete() {
        // Optimiser options - Tries to reach a target framerate of 60fps with a check every 500ms
        const options = new SceneOptimizerOptions(60, 500);
        /* Hardware scaling gracefully degrades the visual quality if the device does not have
        sufficient hardware resource. This runs two passes and sets the scale to a max limit of 1.5 */
        options.addOptimization(this.hardwareScalingOptimisation);

        const optimiser = new SceneOptimizer(this.scene, options);
        // This runs here to ensure the scene achieves a higher frame rate at the cost of degraded visual quality
        optimiser.start();

        // Our built-in 'sphere' shape.
        const sphere = MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            this.scene,
        );
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        sphere.position.x = 3;

        sphere.checkCollisions = true;

        // Registers a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => this.scene.render());

        // The first frame of the animation can take a while to load in, as this is preloading and
        // allocating resources, this can take a while and may cause the game-ready and on-ready
        // events to be called prior to the scene being ready. This.scene.render() is called on the
        // first frame of the render, allowing the subsequent functions to only be performed after
        // this inital render has taken place.
        this.scene.render();
    }
}
