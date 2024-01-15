// Constants
import { Scene, TextureAssetTask, Vector3 } from "babylonjs";
import FeaturedGame from "./featuredGame";
import { IRecommendedGame } from "../constants/GameConfig";

// On losing the minigame, a game link is added to the scene in order to get players to go through
// to a game on the site, as part of the first and second rounds of feedback there was strong
// suggestions that this was insufficient. This class has aimed to fix this by generating upto
// 6 game cube, which are clickable and redirect users to a game.
export default class FeaturedGameWall {
    private gameCubes: FeaturedGame[] = [];
    constructor(
        scene: Scene,
        gameTileTextureAssetTasks: TextureAssetTask[],
        reccomendedGames: IRecommendedGame[],
    ) {
        // Max amount of game cubes set as six (all are within camera frame)
        const numberOfCubes = reccomendedGames.length > 6 ? 6 : reccomendedGames.length;
        for (let i = 0; i < numberOfCubes; i++) {
            let xOffset = -0.8;
            let reduceColumnHeight = 0;
            // let featuredGameTexture = gameTileTexture + i;
            if (i >= 3) {
                xOffset = 0.8;
                reduceColumnHeight = 3;
            }
            if (gameTileTextureAssetTasks[i].isCompleted) {
                const featuredGame = new FeaturedGame(
                    scene,
                    gameTileTextureAssetTasks[i].texture,
                    reccomendedGames[i].gameUrl,
                    new Vector3(xOffset, (i - reduceColumnHeight) * 1.1 + 0.4, 0.1),
                );
                this.gameCubes.push(featuredGame);
            }
        }
    }
}
