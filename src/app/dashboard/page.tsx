'use client';

import { useState, useEffect } from 'react';
import PriceDisplay from '../components/PriceDisplay';
import PieChart from '../components/PieChartSeason';
import SeasonLevelChart from '../components/SeasonLevelChart';
import FilterBar from '../components/FilterBar';
import ProjectInfo from '../components/Presentation';

const Dashboard = () => {
  // Déclaration des états pour les données et les filtres
  const [data, setData] = useState([]);  // Contiendra les données récupérées depuis l'API
  const [filters, setFilters] = useState<any>({});  // Contiendra les filtres appliqués

  // useEffect pour récupérer les données lors du premier rendu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requête vers l'API pour récupérer les données
        const res = await fetch('/api/data');

        // Gestion des erreurs HTTP
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Parsing des données JSON
        const newData = await res.json();

        // Si aucune donnée n'est trouvée, on lève une erreur
        if (!newData || newData.length === 0) {
          throw new Error('No data found');
        }

        // Mise à jour de l'état 'data' avec les nouvelles données
        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error); // Gestion des erreurs
      }
    };

    // Appel de la fonction pour récupérer les données
    fetchData();
  }, []); // Le tableau vide [] signifie que cet effet s'exécute seulement au premier rendu

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);  // Mise à jour de l'état des filtres
  }

  return (
    <div className="min-h-screen bg-[#1D3557] p-8"> {/* Fond bleu foncé avec padding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section à gauche : Prix et Filtrage */}
        <div className="lg:col-span-1 bg-[#F1F1F1] shadow-lg rounded-lg p-6 space-y-6">
          {/* Affichage des informations du projet */}
          <ProjectInfo 
            name='Nicolas Werbrouck'
            githubProfile='https://github.com/zbzxx'
            linkedinProfile='https://www.linkedin.com/in/nicolas-werbrouck-952b7a300/'
          />

          {/* Affichage des prix à l'aide du composant PriceDisplay */}
          <PriceDisplay data={data} />

          {/* Filtrage sous le composant PriceDisplay */}
          <div className="bg-[#F1F1F1] shadow-lg rounded-lg p-6">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Section à droite : Graphiques */}
        <div className="lg:col-span-2 space-y-8">
          {/* Graphiques */}
          <div className="flex flex-col space-y-4">
            {/* Graphique en camembert */}
            <div className="bg-[#F1F1F1] shadow-lg rounded-lg p-6">
              <PieChart />
            </div>

            {/* Graphique par saison et niveau */}
            <div className="bg-[#F1F1F1] shadow-lg rounded-lg p-6">
              <SeasonLevelChart filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
