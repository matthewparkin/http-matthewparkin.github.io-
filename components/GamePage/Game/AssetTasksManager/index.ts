import { AssetsManager, TextureAssetTask } from "babylonjs";
import { Models } from "../constants/Assets";

export default class AssetTasksManager {
    gameTileTextureTasks!: TextureAssetTask[];

    constructor(assetsManager: AssetsManager, assetBaseUrl: string) {
        // Mesh task loads in the mesh and mesh textures from the glb file
        assetsManager.addMeshTask("king task", "", assetBaseUrl, Models.king);
        // assetsManager.addMeshTask("marble task", "", assetBaseUrl, Models.marbleRun);
        assetsManager.addMeshTask("box task", "", assetBaseUrl, Models.lootBox);
    }
}
