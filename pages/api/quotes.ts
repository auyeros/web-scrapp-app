import type { NextApiRequest, NextApiResponse } from 'next';
import { Cluster } from 'puppeteer-cluster';


type Data = [{
  buy_price: string,
  sell_price: string,
  source: string
}]



export default async function getQuotes(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
let quotesArray = [];

await (async () => {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 3,
        });
        
        const ambitoPrecio = async ({ page, data: url }) => {
        let valoresAmbito = []   
            await page.goto(url);
            const compraAmbito = await page.evaluate(()=> {
              
              const ppTag = document.querySelector("body > main > div.widget-wrapper > div:nth-child(8) > div:nth-child(2) > div > div.d-flex.flex-row.align-items-end.align-items-md-center.w-100 > div.first.m-0.w-auto > span.value.data-compra");
              
              return ppTag?.innerHTML;
              
              
            });   
            const ventaAmbito = await page.evaluate(()=> {
              const spTag = document.querySelector("body > main > div.widget-wrapper > div:nth-child(8) > div:nth-child(2) > div > div.d-flex.flex-row.align-items-end.align-items-md-center.w-100 > div.second.m-0.w-auto > span.value.data-venta");
              return spTag?.innerText;
            });
            
            valoresAmbito.push({
              buy_price: compraAmbito,
              sell_price: ventaAmbito,
              source: url
            });
          quotesArray.push.apply(quotesArray, valoresAmbito);
          console.log(quotesArray, 'AMBITO')

        };

        const dolarHoyPrecio = async ({ page, data: url }) => {
          let valoresHoy = []   

            await page.goto(url);
          const compraHoy = await page.evaluate(()=> {
            const ppTag = document.querySelector("#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.compra > div.val");
            
            return ppTag?.innerHTML.substring(1).concat('0');
          
          });
          
          const ventaHoy = await page.evaluate(()=> {
            const spTag = document.querySelector("#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val");
            return spTag?.innerHTML.substring(1).concat('0');
          });

          valoresHoy.push({
            buy_price: compraHoy,
            sell_price: ventaHoy,
            source: url
          });
        quotesArray.push.apply(quotesArray, valoresHoy);
        console.log(quotesArray, 'DOLARHOY')
        };

        const cronistaPrecio = async ({ page, data: url }) => {
          let valoresCronista = []   

          await page.goto(url);
        const compraCronista = await page.evaluate(()=> {
          const ppTag = document.querySelector("#market-scrll-1 > li > a > span.buy > div > div.buy-value");
          return ppTag?.innerText.substring(1);
        });
        
        const ventaCronista = await page.evaluate(()=> {
          const spTag = document.querySelector("#market-scrll-1 > li > a > span.sell > div > div.sell-value");
          return spTag?.innerText.substring(1);
        });
        
        valoresCronista.push({
          buy_price: compraCronista,
          sell_price: ventaCronista,
          source: url
        });
      quotesArray.push.apply(quotesArray, valoresCronista);
      console.log(quotesArray, 'CRONISTA')
      };

        cluster.queue('https://www.ambito.com/contenidos/dolar.html', ambitoPrecio);
        cluster.queue('https://dolarhoy.com/', dolarHoyPrecio);
        cluster.queue('https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB', cronistaPrecio)

        
        await cluster.idle();
        await cluster.close();
      })
      ()
  res.status(200).json({quotesArray})
}
