import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import GamePage from "./game";

const Home: NextPage = () => {
  return (

    <React.Fragment>
      <div className={styles.container}>
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


          <GamePage />
          
          <div className={styles.grid}>
            <a href="" className={styles.card}>
              <h2>Games &rarr;</h2>
              <p>I make web games using WebGL frameworks like PixiJS and Babylon JS.</p>
            </a>

            <a href="" className={styles.card}>
              <h2>Photography &rarr;</h2>
              <p>
                {
                  "I'm a huge fan of photoshop and love taking photos, you might see some on this site ;)"
                }
              </p>
            </a>

            <a href="" className={styles.card}>
              <h2>Developer &rarr;</h2>
              <p>I predominately work in typescript and react. </p>
            </a>

            <a href="" className={styles.card}>
              <h2>Design &rarr;</h2>
              <p>I like designing: 3D, 2D and web design</p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </React.Fragment>
  );
};

export default Home;
