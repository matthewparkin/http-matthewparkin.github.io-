import { AssetsManager, TextureAssetTask } from "babylonjs";
import { Models } from "../constants/Assets";

export default class AssetTasksManager {
    gameTileTextureTasks!: TextureAssetTask[];

    constructor(assetsManager: AssetsManager, assetBaseUrl: string) {
        // Asset tasks have been moved into their own class, this makes the code easier to read and
        // means the texture tasks are prepared and added to the asset manager.
        // Texture tasks are used by the loader to preload assets before returning a game ready action
        // this means we don't have performance issues from loading assets mid-game.
        // Mesh task loads in the mesh and mesh textures from the MACHINE_BODY.glb file
        // assetsManager.addMeshTask("pm task", "", assetBaseUrl, Models.king);
        // assetsManager.addMeshTask("pm task", "", assetBaseUrl, Models.marbleRun);
    }
}
