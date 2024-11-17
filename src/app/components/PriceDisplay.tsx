import React, { useEffect, useState } from 'react';

interface PriceDisplayProps {
  data: any[];
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const [prices, setPrices] = useState<any[]>([]);
  const [seasonStats, setSeasonStats] = useState<Record<string, { total: number; average: number; count: number }>>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch('/api/data?action=priceList');
        const data = await response.json();
        setPrices(data.priceList);
        setSeasonStats(data.seasonStats);  // Récupère les statistiques par saison
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    }

    fetchPrices();
  }, []);

  // Calcul des prix totaux et moyens globaux
  const totalPrice = prices.reduce((acc, item) => acc + item.prix, 0);
  const averagePrice = prices.length ? totalPrice / prices.length : 0;

  // Capitalize the first letter of each season
  const capitalizeSeason = (season: string) => {
    return season.charAt(0).toUpperCase() + season.slice(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 shadow-md rounded-lg">
      {/* Section des prix totaux et moyens globaux */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Prix Total et Moyen
        </h2>
        <div className="flex justify-between items-center text-lg text-gray-700">
          <div className="flex flex-col items-start">
            <p className="font-medium">Prix Total :</p>
            <p className="text-xl text-green-600">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-medium">Prix Moyen :</p>
            <p className="text-xl text-blue-600">${averagePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Section des prix total et moyen par saison */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Prix par Saison
        </h2>
        {Object.keys(seasonStats).map((season) => {
          const { total, average } = seasonStats[season];
          return (
            <div key={season} className="flex justify-between items-center text-lg text-gray-700 mb-4">
              <div className="flex flex-col items-start">
                <p className="font-medium">{capitalizeSeason(season)} - Prix Total :</p>
                <p className="text-xl text-green-600">${total.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="font-medium">{capitalizeSeason(season)} - Prix Moyen :</p>
                <p className="text-xl text-blue-600">${average.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceDisplay;
