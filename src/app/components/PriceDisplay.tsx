import React from 'react';

interface PriceDisplayProps {
  data: any[]; 
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const totalPrice = data.reduce((acc, item) => acc + item.price, 0);
  const averagePrice = data.length ? totalPrice / data.length : 0;

  return (
    <div>
      <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      <h3>Average Price: ${averagePrice.toFixed(2)}</h3>
    </div>
  );
};

export default PriceDisplay;
