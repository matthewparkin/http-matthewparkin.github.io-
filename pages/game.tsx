import * as React from "react";

export interface IProps {
    // assetBaseUrl - is a relative base url for where the assets are hosted eg."public/", might use this more as develop
    assetBaseUrl: string;
}

// Config options to launch the game config
type IState = {
    hasWon: boolean;
};

class GamePage extends React.Component<IProps, IState> {

    // This is a reference to the canvas component that BabylonJS will use to render to
    private canvasRef = React.createRef<HTMLCanvasElement>();

    // render() - renders html components
    public render() {
        return (
            <div>
                <canvas ref={this.canvasRef} />
            </div>
        );
    }

}

export default GamePage;
