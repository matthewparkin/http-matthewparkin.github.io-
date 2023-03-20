import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "./index.module.css";
import GamePage from "../components/GamePage";

const Home: NextPage = () => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div>
                    <GamePage assetBaseUrl={"/"} />
                </div>
                <Head>
                    <title>{"Matthew Parkin's Portfolio"}</title>
                    <meta name="description" content="My portfolio using next JS" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <h1 className={styles.title}>Welcome!</h1>

                    <p className={styles.description}>
                        <code className={styles.code}>{"I'm Matthew Parkin"}</code>
                    </p>

                    <p className={styles.description}>
                        I am a developer, learning fun things and experimenting with 3d games!!!
                    </p>
                </main>

                {/* <footer className={styles.footer}></footer> */}
            </div>
        </React.Fragment>
    );
};

export default Home;
