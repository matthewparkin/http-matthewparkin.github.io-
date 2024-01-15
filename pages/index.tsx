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
                <meta
                    name="description"
                    content="My portfolio using NextJS and the Babylon JS framework"
                />
                <link rel="icon" href="/favicon.ico" />

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia" />
            </Head>
            <div className={styles.container}>
                <GamePage assetBaseUrl={""} />
            </div>
            <section className={styles.bg_image_1}>
                <div className={styles.content}>
                    <h2>Matthew Parkins Portfolio </h2>
                    <p>Stay tuned, more interesting stuff coming soon!</p>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Home;
