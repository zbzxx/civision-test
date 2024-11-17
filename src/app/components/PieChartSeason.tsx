import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import du plugin pour les labels de données

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  // useEffect pour récupérer les données et mettre à jour l'état chartData
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel à l'API pour récupérer les données par saison
        const response = await fetch('/api/data?action=countBySeason');
        const data = await response.json();

        // Formatage des données pour le graphique
        setChartData({
          labels: ['Été', 'Hiver', 'Printemps', 'Automne'], // Libellés des saisons
          datasets: [
            {
              label: 'Nombre d\'éléments', // Label de la série de données
              data: [data.été, data.hiver, data.printemps, data.automne], // Données à afficher sur le graphique
              backgroundColor: [ // Couleurs de fond pour chaque section du graphique
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
              borderColor: [ // Couleurs des bordures pour chaque section
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1, // Largeur des bordures
            },
          ],
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData(); // Appeler la fonction pour récupérer les données au chargement du composant
  }, []); // Le tableau vide signifie que l'effet ne se déclenche qu'une seule fois, après le premier rendu

  // Affichage d'un message de chargement si les données ne sont pas encore disponibles
  if (!chartData) return <p>Chargement...</p>;

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-96 h-96"> {/* Taille du conteneur du graphique */}
        <Pie
          data={chartData} // Données à passer à Chart.js
          options={{
            responsive: true, // Le graphique s'ajuste selon la taille du conteneur
            plugins: {
              legend: {
                position: 'right' as const, // La légende sera affichée à droite
                labels: {
                  color: '#4B5563', // Couleur des labels de la légende
                },
              },
              title: {
                display: true, // Affichage du titre
                text: 'Répartition des éléments par saison', // Texte du titre
                color: '#1F2937', // Couleur du titre
                font: {
                  size: 16, // Taille de la police du titre
                },
              },
              datalabels: { // Options du plugin pour afficher les labels sur chaque section
                color: '#fff', // Couleur des labels de données
                font: {
                  weight: 'bold', // Poids de la police des labels
                  size: 14, // Taille de la police des labels
                },
                formatter: (value: any) => value, // Affiche la valeur de chaque section sur le graphique
              },
            },
            maintainAspectRatio: false, // Permet au graphique de s'ajuster indépendamment du ratio
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;