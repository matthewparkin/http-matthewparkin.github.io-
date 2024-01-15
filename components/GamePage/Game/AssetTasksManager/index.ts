import { AssetsManager, TextureAssetTask } from "babylonjs";
import { Textures, Models } from "../constants/Assets";
import { IGameLaunchConfig } from "../constants/GameConfig";

export default class AssetTasksManager {
    gameTileTextureTasks!: TextureAssetTask[];
    bodyBumpTextureTask: TextureAssetTask;
    bodyBumpNormalTextureTask: TextureAssetTask;
    winReelTextureTask: TextureAssetTask;
    winReelNormalTextureTask: TextureAssetTask;
    shadowMapTextureTask: TextureAssetTask;
    floorTextureTask: TextureAssetTask;
    floorNormalTextureTask: TextureAssetTask;
    fabricNormalTextureTask: TextureAssetTask;

    constructor(assetsManager: AssetsManager, assetBaseUrl: string, config: IGameLaunchConfig) {
        // Asset tasks have been moved into their own class, this makes the code easier to read and
        // means the texture tasks are prepared and added to the asset manager.
        // Texture tasks are used by the loader to preload assets before returning a game ready action
        // this means we don't have performance issues from loading assets mid-game.
        this.bodyBumpTextureTask = assetsManager.addTextureTask(
            "body bump task",
            assetBaseUrl + Textures.BODY_BUMP,
        );

        this.bodyBumpNormalTextureTask = assetsManager.addTextureTask(
            "body bump normal task",
            assetBaseUrl + Textures.BODY_BUMP_NORMAL,
        );

        this.winReelTextureTask = assetsManager.addTextureTask(
            "body bump task",
            assetBaseUrl + Textures.WIN_REEL,
        );

        this.winReelNormalTextureTask = assetsManager.addTextureTask(
            "body bump normal task",
            assetBaseUrl + Textures.WIN_REEL_NORMAL,
        );

        this.shadowMapTextureTask = assetsManager.addTextureTask(
            "Shadow mask task",
            assetBaseUrl + Textures.SHADOW_MAP,
        );

        this.floorTextureTask = assetsManager.addTextureTask(
            "floor task",
            assetBaseUrl + Textures.STONE,
        );

        this.floorNormalTextureTask = assetsManager.addTextureTask(
            "floor normal task",
            assetBaseUrl + Textures.STONE_NORMAL,
        );

        this.fabricNormalTextureTask = assetsManager.addTextureTask(
            "fabric normal task",
            assetBaseUrl + Textures.FABRIC_NORMAL,
        );

        // In the future the game assets should be better not being hard coded, this soloution
        // currently only allows images that are available in the texture folder
        this.gameTileTextureTasks = config.recommendedGames.map(
            (recommendedGame: { textureUrl: any }) => {
                return assetsManager.addTextureTask(
                    "Game tile task",
                    `${assetBaseUrl}${recommendedGame.textureUrl}`,
                );
            },
        );

        // Mesh task loads in the mesh and mesh textures from the MACHINE_BODY.glb file
        assetsManager.addMeshTask("pm task", "", assetBaseUrl + "/models/", Models.MACHINE_BODY);
    }
}
