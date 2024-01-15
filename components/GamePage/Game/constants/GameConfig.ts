export interface IRecommendedGame {
    textureUrl: string;
    gameUrl: string;
}

export interface IGameLaunchConfig {
    hasWon: boolean;
    isMega: boolean;
    infoUrl: string;
    latestGameName: string;
    latestGameUrl: string;
    firstSpin?: boolean;
    debug: boolean;
    showToolTip: boolean;
    recommendedGames: IRecommendedGame[];
}
