import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'slipingapi' })
}


import puppeteer from "puppeteer";


// (async () => {
//   const browser = await puppeteer.launch({headless: false});
//   const page = await browser.newPage();
//   await page.goto("https://dolarhoy.com/");

//   const grabPrice = await page.evaluate(()=> {
//     const spTag = document.querySelector("a[href='/cotizaciondolarblue']");
//     return spTag?.innerHTML;
//   });
//   console.log(grabPrice)
//   await browser.close();
// })();