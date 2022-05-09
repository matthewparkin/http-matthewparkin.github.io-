import {
    Color3,
    Color4,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    Vector3,
} from "babylonjs";
import Camera from "./components/Camera";
import PlayerChar from "./components/PlayerChar";

// Class for game logic
export default class Game {
    private engine: Engine;
    private scene: Scene;

    private assetBaseUrl: string;

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
        SceneLoader.ShowLoadingScreen = false;

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

        // Our built-in 'sphere' shape.
        const sphere = MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            this.scene
        );
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        sphere.position.x = 3;

        sphere.checkCollisions = true;

        // const boundingCube = MeshBuilder.CreateBox(
        //     "boundingBox",
        //     { size: 190, height: 10 },
        //     this.scene
        // );
        // boundingCube.checkCollisions = true;

        // Add camera to the scene
        new Camera(this.scene, canvas);

        const playerChar = new PlayerChar(this.scene);

        // Registers a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => this.scene.render());

        this.scene.render();

        // Watcher for browser/canvas resize events
        window.addEventListener("resize", () => this.engine.resize());
    }
}
