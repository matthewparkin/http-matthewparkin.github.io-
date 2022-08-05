import { Color3, KeyboardEventTypes, Matrix, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";

export default class PlayerChar {
    constructor(scene: Scene) {
        const base = new Mesh("marbleChar");
        const bodyDiam = 2;
        const body = MeshBuilder.CreateSphere("marble", { diameter: bodyDiam });

        // body.checkCollisions = true;
        body.parent = base;
        base.position.y = 0.5 * bodyDiam;

        const extra = 0.25;
        base.ellipsoid = new Vector3(0.5 * bodyDiam, 0.5 * bodyDiam, 0.5 * bodyDiam); //x and z must be same value
        base.ellipsoid.addInPlace(new Vector3(extra));
        const offsetY = 0.5 * bodyDiam - base.position.y;
        base.ellipsoidOffset = new Vector3(0, offsetY, 0);
        //Create Visible Ellipsoid around camera
        const a = base.ellipsoid.x;
        const b = base.ellipsoid.y;
        const points = [];
        for (let theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
            points.push(new Vector3(0, b * Math.sin(theta) + offsetY, a * Math.cos(theta)));
        }

        const ellipse = [];
        ellipse[0] = MeshBuilder.CreateLines("characterMoveBounds", { points: points }, scene);
        ellipse[0].color = Color3.Red();
        ellipse[0].parent = base;
        const steps = 12;
        const dTheta = (2 * Math.PI) / steps;
        for (let i = 1; i < steps; i++) {
            ellipse[i] = ellipse[0].clone("characterMoveBounds" + i);
            ellipse[i].parent = base;
            ellipse[i].rotation.y = i * dTheta;
        }

        //keyboard moves
        const forward = new Vector3(0, 0, 1);
        let angle = 0;
        let matrix = Matrix.Identity();

        //line to indicate direction
        let line = MeshBuilder.CreateLines("pointer", {
            points: [
                base.position.add(new Vector3(0, 1, 0)),
                base.position.add(new Vector3(0, 1, 0)).add(forward.scale(3)),
            ],
            updatable: true,
        });
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                            angle -= Math.PI / 100;
                            Matrix.RotationYToRef(angle, matrix);
                            Vector3.TransformNormalToRef(forward, matrix, forward);
                            base.rotation.y = angle;
                            break;
                        case "d":
                        case "D":
                            angle += Math.PI / 100;
                            Matrix.RotationYToRef(angle, matrix);
                            Vector3.TransformNormalToRef(forward, matrix, forward);
                            base.rotation.y = angle;
                            break;
                        case "w":
                        case "W":
                            base.moveWithCollisions(forward.scale(0.1));
                            break;
                        case "s":
                        case "S":
                            base.moveWithCollisions(forward.scale(-0.1));
                            break;
                    }
                    break;
            }
            line = MeshBuilder.CreateLines("pointer", {
                points: [
                    base.position.add(new Vector3(0, 1, 0)),
                    base.position.add(new Vector3(0, 1, 0)).add(forward.scale(3)),
                ],
                instance: line,
            });
        });
    }
}
