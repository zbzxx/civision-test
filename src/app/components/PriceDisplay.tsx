import React, {useEffect,useState} from 'react';

interface PriceDisplayProps {
  data: any[]; 
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(()=>{

    async function fetchPrices(){
      try{
          const response = await fetch('/api/data?action=priceList')
          const data = await response.json()
          setPrices(data)
      }catch(error){
        console.error('Erreur lors de la recuperation du data', error)
      }
    }

    fetchPrices()
  }, [])

  const totalPrice = prices.reduce((acc, item)=> acc + item.prix, 0)
  const averagePrice = prices.length ? totalPrice / prices.length : 0

  return(
    <div>
      <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      <h3>Average Price: ${averagePrice.toFixed(2)}</h3>
    </div>
  )

};

export default PriceDisplay;
