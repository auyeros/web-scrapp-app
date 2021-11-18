import type { NextApiRequest, NextApiResponse } from 'next';
import { Cluster } from 'puppeteer-cluster';


type Data = [{
  average_buy_price: string,
  average_sell_price: string,
  source: string
}]



export default async function getAverage(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
let averArray = [];

await (async () => {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 3,
        });
        
        const ambitoPrecio = async ({ page, data: url }) => {
        let valoresAmbito = []   
            await page.goto(url);
            const avCompraAmbito = await page.evaluate(()=> {
            const ppTag = document.querySelector("body > main > div.widget-wrapper > div:nth-child(8) > div:nth-child(2) > div > div.d-flex.flex-row.align-items-end.align-items-md-center.w-100 > div.first.m-0.w-auto > span.value.data-compra");
              
            return ppTag?.innerText;
              
              
            });   
            const avVentaAmbito = await page.evaluate(()=> {
              const spTag = document.querySelector("body > main > div.widget-wrapper > div:nth-child(8) > div:nth-child(2) > div > div.d-flex.flex-row.align-items-end.align-items-md-center.w-100 > div.second.m-0.w-auto > span.value.data-venta");
              return spTag?.innerText;
            });
            
            valoresAmbito.push({
              average_buy_price: avCompraAmbito,
              average_sell_price: avVentaAmbito,
              source: url
            });
          averArray.push.apply(averArray, valoresAmbito);
          console.log(averArray, 'AMBITO')

        };

        const dolarHoyPrecio = async ({ page, data: url }) => {
          let valoresHoy = []   
            await page.goto(url);
            const avCompraHoy = await page.evaluate(()=> {
            const ppTag = document.querySelector("#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.compra > div.val");
            
            return ppTag?.innerText.substring(1).concat('0');
          
          });
          
          const avVentaHoy = await page.evaluate(()=> {
            const spTag = document.querySelector("#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val");
            return spTag?.innerText.substring(1).concat('0');
          });
          
          valoresHoy.push({
            average_buy_price: avCompraHoy,
            average_sell_price: avVentaHoy,
            source: url
          });
        averArray.push.apply(averArray, valoresHoy);
        console.log(averArray, 'DOLARHOY')
        };

        const cronistaPrecio = async ({ page, data: url }) => {
          let valoresCronista = []   

          await page.goto(url);
        const avCompraCronista = await page.evaluate(()=> {
          const ppTag = document.querySelector("#market-scrll-1 > li > a > span.buy > div > div.buy-value");
          return ppTag?.innerText.substring(1);
        });
        
        const avVentaCronista = await page.evaluate(()=> {
          const spTag = document.querySelector("#market-scrll-1 > li > a > span.sell > div > div.sell-value");
          return spTag?.innerText.substring(1);
        });
        
        valoresCronista.push({
          average_buy_price: avCompraCronista,
          average_sell_price: avVentaCronista,
          source: url
        });
      averArray.push.apply(averArray, valoresCronista);
      console.log(averArray, 'CRONISTA')
      };

        cluster.queue('https://www.ambito.com/contenidos/dolar.html', ambitoPrecio);
        cluster.queue('https://dolarhoy.com/', dolarHoyPrecio);
        cluster.queue('https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB', cronistaPrecio)

        
        await cluster.idle();
        await cluster.close();
      })
      ()
      res.status(200).json({averArray})


      // let buyPrice = averArray.map(quote => quote.average_buy_price)
      // console.log(buyPrice)
      
      // let sellPrice = averArray.map(quote => quote.average_sell_price)
      // console.log(sellPrice)
      
    // let count = 0;
    // let total= 0;
    // for(let i=0; i < buyPrice.length; i++){
    //   if(buyPrice[i] !== undefined){
    //     count++;
    //     total += buyPrice[i]
    //   }
    // }
    // let average = total / count;
    // console.log(average)
}


   

