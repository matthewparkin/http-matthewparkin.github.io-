import * as React from "react";
import Game from "./Game";
import styles from "./index.module.css";

export interface IProps {
    // assetBaseUrl - is a relative base url for where the assets are hosted eg."public/", might use this more as develop
    assetBaseUrl: string;
}

// Config options to launch the game config
type IState = {
    hasWon: boolean;
};

class GamePage extends React.Component<IProps, IState> {
    private game: Game | null = null;

    // This is a reference to the canvas component that BabylonJS will use to render to
    private canvasRef = React.createRef<HTMLCanvasElement>();

    public constructor(props: IProps) {
        super(props);

        // Initialise state
        this.state = {
            hasWon: false,
        };
    }

    public componentDidMount() {
        const canvasElement = this.canvasRef.current;

        if (canvasElement) {
            console.info("👷 Canvas attached");
            this.createGame(canvasElement);
        } else {
            console.error("Canvas element null");
        }
    }

    // createGame - Creates new PrizeMachine3DGame
    private createGame(canvasElement: HTMLCanvasElement) {
        this.game = new Game(canvasElement, this.props.assetBaseUrl);

        return this.game;
    }

    // render() - renders html components
    public render() {
        return <canvas className={styles.renderCanvas} ref={this.canvasRef} />;
    }
}

export default GamePage;
