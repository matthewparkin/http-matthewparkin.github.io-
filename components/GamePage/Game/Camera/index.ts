import {
    ArcRotateCamera,
    ArcRotateCameraPointersInput,
    FreeCamera,
    Scene,
    Vector2,
    Vector3,
} from "babylonjs";

// Gsap is a helpful plugin for managing tweens and animations. https://greensock.com/docs/v3
// import gsap, { Sine } from "gsap";

export default class Camera extends FreeCamera {
    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        // Camera initial set
        super("Camera", new Vector3(0, 2, 10), scene);
        this.setTarget(new Vector3(0, 0.4, 0));

        /* The `FOVMODE_HORIZONTAL_FIXED` sets the camera resize to the horizontal scale */
        this.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
        this.fov = 1;

        this.inertia = 0.4;
        this.attachControl(canvas, true);
        this.minZ = 0.45;

        //Then apply collisions and gravity to the active camera
        this.checkCollisions = true;
        this.applyGravity = true;

        //Set the ellipsoid around the camera (e.g. your player's size)
        this.ellipsoid = new Vector3(1, 1, 1);
    }
}

// export default class Camera extends ArcRotateCamera {
//     cameraFocus: Vector3;
//     isMega: boolean;
//     constructor(scene: Scene, canvas: HTMLCanvasElement, isMega: boolean) {
//         // Camera initial set
//         super("Camera", -Math.PI / 2, -Math.PI / 2, 10, new Vector3(0, 0, 5), scene);
//         this.isMega = isMega;
//         this.targetScreenOffset = new Vector2(0, -1.6);
//         this.cameraFocus = new Vector3(0.0, 0.0, 0.0);

//         /* The `FOVMODE_HORIZONTAL_FIXED` sets the camera resize to the horizontal scale
//         Which means upon resizing the window the width controls how much the model zooms in by
//         when scaling up, as opposed to the default which is height, the height is then controlled
//         by the handleResizer() function in the game index,
//         so the main part of the prizemachine is always in view */
//         this.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
//         this.inertia = 0.2;
//         this.allowUpsideDown = false;
//         this.wheelDeltaPercentage = 0.01;
//         this.attachControl(canvas, true);

//         const pointersInput = this.inputs.attached.pointers as ArcRotateCameraPointersInput;
//         // pointersInput.multiTouchPanAndZoom = false;
//         // pointersInput.multiTouchPanning = false;
//         // pointersInput.pinchInwards = false;
//         // pointersInput.useNaturalPinchZoom = false;
//         // pointersInput.buttons = [0];

//         // this.inputs.remove(this.inputs.attached.mouse);
//         // this.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
//         // this.inputs.removeByType("ArcRotateCameraMouseWheelInput");

//         this.fov = 0.5;

//         // This limits the amount the camera can dolly in and out
//         // TODO - This will need more tweaking dependant on devices and testing and breakpoints may
//         // have to be introduced to support ultrawide screens and stop the cut off of impotant info
//         // this.lowerRadiusLimit = 7;
//         // this.upperRadiusLimit = 15.5;

//         // This controls upper and lower bounds of the camera meaning you cannot go through the floor
//         // this.lowerBetaLimit = 1.3; // Affects not being able to see above the PM
//         // this.upperBetaLimit = 1.65; // Affects not being able to see through the ground

//         // this.lowerAlphaLimit = Math.PI / 2 - 0.25;
//         // this.upperAlphaLimit = Math.PI / 2 + 0.25;

//         // Sets the focus point
//         this.setTarget(this.cameraFocus);

//     }

//     public async winCameraDollyIn() {
//         gsap.to(this, {
//             ease: Sine.easeInOut,
//             // Resets camera left and right to focus to center with up and down controllers being set to
//             // slightly lower than center
//             alpha: Math.PI / 2,
//             beta: 1.5,
//             radius: 14,
//             // Slighly locks up and down controls of camera as not needed for win animation
//             lowerBetaLimit: 1.5,
//             upperBetaLimit: 1.55,
//             duration: 1,
//         });

//         // Upon device testing on some tall android phones the mega signage can be clipped through
//         // by the camera. The extra height avoids this without clipping into the ceiling.
//         let machineHeightOffset = 1.8;
//         if (this.isMega) {
//             machineHeightOffset = 2.3;
//         }

//         // This tween animates the camera up and in with a soft ease in
//         await gsap.to(this.cameraFocus, {
//             ease: Sine.easeIn,
//             y: machineHeightOffset,
//             z: -10.5,
//             duration: 2,
//         });

//         // This tilts the camera view down slighly to focus on the win text
//         gsap.to(this, {
//             ease: Sine.easeInOut,
//             lowerBetaLimit: 1.45,
//             beta: 1.45,
//             duration: 2,
//         });

//         // This tween animates the camera back down and further in with a ease out in to keep the
//         // motion fluid the duration should be kept the same
//         await gsap.to(this.cameraFocus, {
//             ease: Sine.easeOut,
//             y: -1,
//             z: -21,
//             duration: 2,
//         });
//     }
// }
