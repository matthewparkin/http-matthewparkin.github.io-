import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "./index.module.css";
import GamePage from "../components/GamePage";

const Home: NextPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>{"Matthew Parkin's Portfolio"}</title>
                <meta name="description" content="My portfolio using next JS" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <GamePage assetBaseUrl={"/"} />
            </div>
        </React.Fragment>
    );
};

export default Home;
