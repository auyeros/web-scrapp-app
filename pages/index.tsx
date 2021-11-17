import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import styles from '../styles/Home.module.css'

import puppeteer from "puppeteer";


(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto("https://dolarhoy.com/");

  const grabPrice = await page.evaluate(()=> {
    const spTag = document.querySelector("a[href='/cotizaciondolarblue']");
    return spTag?.innerHTML;
  });
  console.log(grabPrice)
  await browser.close();
})();

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web Scrapper 2021</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
