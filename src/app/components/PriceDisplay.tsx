import React, { useEffect, useState } from 'react';

interface PriceDisplayProps {
  data: any[]; // Représente les données de prix passées en tant que prop
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  // Déclare les états pour les prix et les statistiques par saison
  const [prices, setPrices] = useState<any[]>([]); 
  const [seasonStats, setSeasonStats] = useState<Record<string, { total: number; average: number; count: number }>>({});

  // Utilisation de useEffect pour charger les données lors du premier rendu
  useEffect(() => {
    // Fonction asynchrone pour récupérer les prix et statistiques depuis l'API
    async function fetchPrices() {
      try {
        // Envoi de la requête à l'API pour obtenir la liste des prix et les statistiques par saison
        const response = await fetch('/api/data?action=priceList');
        const data = await response.json();
        // Mise à jour des états avec les données récupérées
        setPrices(data.priceList);
        setSeasonStats(data.seasonStats);  // Enregistre les statistiques par saison dans l'état
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    }

    // Appel de la fonction pour récupérer les données
    fetchPrices();
  }, []); // Le tableau vide [] signifie que cet effet s'exécute seulement au premier rendu

  // Calcul du prix total et moyen global
  const totalPrice = prices.reduce((acc, item) => acc + item.prix, 0);
  const averagePrice = prices.length ? totalPrice / prices.length : 0; // Eviter la division par zéro

  // Fonction utilitaire pour capitaliser la première lettre de chaque saison
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
        {/* Boucle à travers les saisons pour afficher les statistiques */}
        {Object.keys(seasonStats).map((season) => {
          const { total, average } = seasonStats[season]; // Destructuration des données de la saison
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
