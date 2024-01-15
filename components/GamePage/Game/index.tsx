import {
    AssetsManager,
    Color3,
    Color4,
    DefaultLoadingScreen,
    Engine,
    HardwareScalingOptimization,
    HemisphericLight,
    Matrix,
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
import { IGameLaunchConfig } from "./constants/GameConfig";
import Slot from "./Slot";
import MachineBody from "./MachineBody";
import FeaturedGameWall from "./FeaturedGameWall";
import Lights from "./Lights";

// Class for game logic
export default class Game {
    private engine: Engine;
    private scene: Scene;

    private camera: Camera;
    private slot: Slot | null;
    private machineBody: MachineBody | null;
    private assetTasks!: AssetTasksManager;

    private hardwareScalingOptimisation: HardwareScalingOptimization;
    private assetBaseUrl: string;

    private hasWon: boolean;
    // private onReady: () => void;
    private config: IGameLaunchConfig;

    constructor(canvas: HTMLCanvasElement, assetBaseUrl: string, config: IGameLaunchConfig) {
        // Initialise the canvas and engine
        this.engine = new Engine(
            canvas,
            true,
            { preserveDrawingBuffer: true, stencil: true },
            true,
        ); // Generate the BabylonJS 3D engine

        // Initialise states
        this.assetBaseUrl = assetBaseUrl;
        this.slot = null;
        this.machineBody = null;
        this.config = config;
        this.hasWon = config.hasWon;
        this.hardwareScalingOptimisation = new HardwareScalingOptimization(0, 1.5, 0.25);
        // this.onReady = onReady;

        // // Initialising the Scene
        this.scene = new Scene(this.engine);

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

        // // TODO: Remove the debug layer code before going to production
        // this.scene.debugLayer.show();

        this.scene.ambientColor = Color3.FromHexString("#000000");
        this.scene.clearColor = Color4.FromHexString("#ececec");

        /* By default the resolution of the canvas is scaled up by 0.5, this is not needed for this
        project as performance can take a massive hit without much benefit to the visual quality */
        this.engine.setHardwareScalingLevel(1);

        this.hardwareScalingOptimisation = new HardwareScalingOptimization(0, 1.5, 0.25);

        //Set gravity for the scene (G force like, on Y-axis)
        this.scene.gravity = new Vector3(0, -0.9, 0);

        // Enable Collisions
        this.scene.collisionsEnabled = true;

        //finally, say which mesh will be collisionable
        this.scene.getMeshByName("BackgroundPlane")!.checkCollisions = true;

        // Add camera to the scene
        this.camera = new Camera(this.scene, canvas);

        // Add light to the scene
        // eslint-disable-next-line no-new
        new Lights(this.scene);

        this.loadAssets();

        // Watcher for browser/canvas resize events
        window.addEventListener("resize", () => this.handleResizer(canvas));
        this.handleResizer(canvas);
    }

    private async loadAssets() {
        // The asset manager loads all of the assets progressively.
        const assetsManager = new AssetsManager(this.scene);
        this.assetTasks = new AssetTasksManager(assetsManager, this.assetBaseUrl, this.config);

        // We have our own loading screen so this is not needed - on by default
        assetsManager.useDefaultLoadingScreen = false;

        assetsManager.load();

        assetsManager.onFinish = () => {
            // Builds the machine body asset and changes materials, also adds glow layer to scene
            this.machineBody = new MachineBody(this.config.isMega);
            this.machineBody.build(
                this.scene,
                this.assetTasks.bodyBumpTextureTask.texture,
                this.assetTasks.bodyBumpNormalTextureTask.texture,
                this.assetTasks.shadowMapTextureTask.texture,
                this.assetTasks.floorTextureTask.texture,
                this.assetTasks.floorNormalTextureTask.texture,
                this.assetTasks.fabricNormalTextureTask.texture,
            );

            // Adds in the reels
            this.slot = new Slot(
                this.scene,
                this.assetTasks.winReelTextureTask.texture,
                this.assetTasks.winReelNormalTextureTask.texture,
                this.config.hasWon,
            );

            this.handleGameLoadComplete();
        };
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

        // Registers a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => this.scene.render());

        // The first frame of the animation can take a while to load in, as this is preloading and
        // allocating resources, this can take a while and may cause the game-ready and on-ready
        // events to be called prior to the scene being ready. This.scene.render() is called on the
        // first frame of the render, allowing the subsequent functions to only be performed after
        // this inital render has taken place.
        this.hasWon = true;
        this.spin();
        this.scene.render();
    }

    /* Resize function to handle a resize event, forces a specific field of view based on
    both the height and width of the canvas, ensures the main content of the game is always visible */
    handleResizer(canvas: HTMLCanvasElement) {
        if (this.engine) {
            /* This funtion risizes the FOV on the camera based on the canvas' width, which is set
            in the `Camera` class using the `FOVMODE_HORIZONTAL_FIXED` */
            this.engine.resize();
            // Ensures the canvas height and width takes into account the device hardware scaling
            const trueCanvasHeight = canvas.height * this.engine.getHardwareScalingLevel();
            const trueCanvasWidth = canvas.width * this.engine.getHardwareScalingLevel();

            // The following if statements forces the vignette to adjust based on the aspect ratio
            // of the device. This prevents some devices looking darker than others due to the
            // vignette favouring wide aspect ratios and not those supported on portrait phones.
            if (trueCanvasWidth / trueCanvasHeight < 0.6) {
                this.scene.imageProcessingConfiguration.vignetteCameraFov = 1.3;
            } else if (trueCanvasWidth / trueCanvasHeight < 1) {
                this.scene.imageProcessingConfiguration.vignetteCameraFov = 0.9;
            } else {
                this.scene.imageProcessingConfiguration.vignetteCameraFov = 0.6;
            }

            /* The following if statments now work like css breakpoints where the field of view can
            be adjusted to prevent the top and bottom of a model being cut off in extremly wide
            devices, such as ultrawide screens and landscape mobile phones. */
            const aspectRatio = 1.77777777778; /* This is the aspect ratio for 16:9, most portrait
            and wide screen devices should fall under this, the debug tool informs the user that
            anything that falls within a 16:9 ratio is safe and visible onscreen */
            if (trueCanvasWidth / aspectRatio < trueCanvasHeight) {
                this.camera.fov = 0.4;
            } else if (trueCanvasWidth / trueCanvasHeight < 1.9) {
                this.camera.fov = 0.42;
            } else if (trueCanvasWidth / trueCanvasHeight < 2.05) {
                this.camera.fov = 0.45;
            } else if (trueCanvasWidth / trueCanvasHeight < 2.2) {
                this.camera.fov = 0.48;
            } else if (trueCanvasWidth / trueCanvasHeight < 2.35) {
                this.camera.fov = 0.5;
            }
            // Ultra-wide aspect ratio - 21:9
            else if (trueCanvasWidth / trueCanvasHeight < 2.5) {
                this.camera.fov = 0.52;
            } else if (trueCanvasWidth / trueCanvasHeight < 3) {
                /* Devices that have aspect ratios above 2.5 will be devices that are uncommon but are
            still supported */
                this.camera.fov = 0.6;
            } else if (trueCanvasWidth / trueCanvasHeight < 3.5) {
                this.camera.fov = 0.7;
            } else if (trueCanvasWidth / trueCanvasHeight < 4) {
                this.camera.fov = 0.8;
            } else if (trueCanvasWidth / trueCanvasHeight < 5) {
                this.camera.fov = 0.95;
            } else if (trueCanvasWidth / trueCanvasHeight < 7) {
                this.camera.fov = 1.3;
            } else if (trueCanvasWidth / trueCanvasHeight < 8) {
                this.camera.fov = 1.5;
            } else {
                this.camera.fov = 1.7;
            }
        }
    }

    // Spin function handles spin logic - triggered by react Button
    public async spin() {
        await Promise.all(
            this.slot!.winReels.map((winReel) => {
                return winReel.spin();
            }),
        );

        await this.handleWinReelComplete();
        return this.hasWon;
    }

    public async handleWinReelComplete() {
        // If player has won play winAnimation else play the loseAnimation
        if (this.hasWon) {
            // Win animations, animation functions
            await this.machineBody!.winAnimation();
            await this.machineBody!.curtainOpen();
            // await this.camera.winCameraDollyIn();

            // This isn't async as it's an infinite animation. This allows the button components
            this.machineBody!.hasWonAnimate();

            // Todo: add single reel logic here - This will eventually show the prize won
        } else {
            await this.machineBody!.loseAnimation();
            this.handleGameLink();
        }
    }

    private handleGameLink() {
        // Pointer event to listen to on pointer down
        this.scene.onPointerDown = () => {
            // Picker ray grabs where the pointer is in the scene, and defines a hit value.
            const ray = this.scene.createPickingRay(
                this.scene.pointerX,
                this.scene.pointerY,
                Matrix.Identity(),
                this.camera,
            );

            const hit = this.scene.pickWithRay(ray);

            // If a mesh is hit that has its metadata set to string it will dispatch a redirect action
            // with the correct URL. This is used for the featured game.
            if (hit && hit.pickedMesh && typeof hit.pickedMesh.metadata == "string") {
                // this.gameClient.dispatch(Actions.redirect(hit.pickedMesh.metadata));
                // I will have some logic in here to fire the redirect action to some of my socials or something along those lines
            }
        };

        // Featured game wall shows different recommended games
        // eslint-disable-next-line no-new
        new FeaturedGameWall(
            this.scene,
            this.assetTasks.gameTileTextureTasks,
            this.config.recommendedGames,
        );
    }
}
