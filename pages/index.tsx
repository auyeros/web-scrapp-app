
import React from 'react'
import styles from '../styles/Home.module.css'
import useSWR, {mutate} from 'swr'

const fetcher = (...args) => fetch(...args).then((res)=> res.json());

function Home({ }) {
  const { data, error } = useSWR('/api/quotes', fetcher, {
    // revalidate the data per second
    refreshInterval: 15000
  })


  if (!data) return <h1>loading...</h1>
  if (error) return <h1>There is an error</h1>;

  
  console.log(data.quotesArray);
  return (
    <div>
      <h1>Refetch Interval (15s)</h1>
      <h1>Dolar List</h1>
      <div className="container mx-auto">
            {data.quotesArray.map(d => (
                <><p>Fuente: {d.source}</p><p>Compra: ${d.buy_price}</p><p>Venta: ${d.sell_price}</p></>
            ))}
      </div>
    
    </div>
  )
}





export default Home
