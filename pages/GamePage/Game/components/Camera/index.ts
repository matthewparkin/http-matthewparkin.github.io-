import { FreeCamera, Scene, Vector3 } from "babylonjs";

export default class Camera extends FreeCamera {
    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        // Camera initial set
        super("Camera", new Vector3(2, 2, 8), scene);
        this.setTarget(new Vector3(0, 0.4, 0));

        /* The `FOVMODE_HORIZONTAL_FIXED` sets the camera resize to the horizontal scale */
        this.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
        this.fov = 0.5;

        this.inertia = 0.4;
        this.attachControl(canvas, true);
        this.minZ = 0.45;

        //Then apply collisions and gravity to the active camera
        this.checkCollisions = true;
        // this.applyGravity = true;

        //Set the ellipsoid around the camera (e.g. your player's size)
        this.ellipsoid = new Vector3(1, 1, 1);
    }
}
