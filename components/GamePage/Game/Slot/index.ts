import { Scene, Texture } from "babylonjs";
import WinReel from "./WinReel";

export default class Slot {
    public static globalWinReelWidth: number = 0.87;
    public static globalReelSegments: number = 4;
    public static globalReelDiameter: number = 1.1;
    public static globalReelPositionY: number = 1.112;
    public static globalReelPositionz: number = -1.806;

    public winReels: WinReel[];

    // While considered out of scope for this project this would be where prizes could be displayed,
    // on a seperate prize reel that would animate over of this
    constructor(
        scene: Scene,
        winReeltexture: Texture,
        winReelNormaltexture: Texture,
        hasWon: boolean,
    ) {
        this.winReels = [];
        // Add Reels to an array
        this.winReels.push(
            new WinReel(
                scene,
                Slot.globalWinReelWidth + 0.025,
                winReeltexture,
                winReelNormaltexture,
                "left",
                hasWon,
            ),
        );

        this.winReels.push(
            new WinReel(scene, 0, winReeltexture, winReelNormaltexture, "middle", hasWon),
        );

        this.winReels.push(
            new WinReel(
                scene,
                -(Slot.globalWinReelWidth + 0.025),
                winReeltexture,
                winReelNormaltexture,
                "right",
                hasWon,
            ),
        );
    }
}
