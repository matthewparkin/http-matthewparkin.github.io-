import { Color3, HemisphericLight, Scene, SpotLight, Vector3 } from "babylonjs";

// Lights are added to the scene to have reactive materials on the models.
export default class Lights {
    constructor(scene: Scene) {
        const atmosphericLight = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        atmosphericLight.intensity = 2;
        atmosphericLight.diffuse = new Color3(1, 1, 1);

        const leftLight = new SpotLight(
            "leftLight",
            new Vector3(2.5, 3.8, -0.4),
            new Vector3(0, -0.9, -0.4),
            Math.PI / 2,
            50,
            scene,
        );
        leftLight.diffuse = new Color3(1, 0.6, 0.6);
        leftLight.intensity = 500;
        leftLight.angle = Math.PI / 2;

        const rightLight = new SpotLight(
            "rightLight",
            new Vector3(-2.5, 3.8, -0.4),
            new Vector3(0, -0.9, -0.4),
            Math.PI / 2,
            50,
            scene,
        );
        rightLight.diffuse = new Color3(1, 0.6, 0.6);
        rightLight.intensity = 500;
        rightLight.angle = Math.PI / 2;

        const centerLight = new SpotLight(
            "centerLight",
            new Vector3(0, 3.4, 1.6),
            new Vector3(0, -0.9, -0.4),
            Math.PI / 2,
            50,
            scene,
        );
        centerLight.diffuse = new Color3(1, 1, 1);
        centerLight.intensity = 500;
        centerLight.angle = Math.PI / 2;
    }
}
