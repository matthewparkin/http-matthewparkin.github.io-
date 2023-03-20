import { Scene, TransformNode } from "babylonjs";

// Finds transform node from the gtlf file
export const findByMeshGroup = (id: string) => {
    return (meshes: TransformNode) => {
        return meshes.id == id;
    };
};

// Callback to return gets mesh name
export const getMeshGroupByName = (
    name: string,
    scene: Scene,
    callBack: (mesh: TransformNode) => void
) => {
    const mesh = scene.transformNodes.find(findByMeshGroup(name));
    if (mesh) {
        callBack(mesh);
    } else {
        console.warn("unable to find transform node " + name);
    }
};
