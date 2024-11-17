import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data?action=countBySeason');
        const data = await response.json();

        setChartData({
          labels: ['Été', 'Hiver', 'Printemps', 'Automne'],
          datasets: [
            {
              label: 'Nombre d\'éléments',
              data: [data.été, data.hiver, data.printemps, data.automne],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Chargement...</p>;

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-96 h-96"> {/* Taille du conteneur du graphique, ajustée pour être plus grande */}
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right' as const, // Position de la légende à droite
                labels: {
                  color: '#4B5563',
                },
              },
              title: {
                display: true,
                text: 'Répartition des éléments par saison',
                color: '#1F2937',
                font: {
                  size: 16,
                },
              },
              datalabels: { // Options du plugin de labels de données
                color: '#fff',
                font: {
                  weight: 'bold',
                  size: 14,
                },
                formatter: (value: any) => value, // Affiche les valeurs des tranches
              },
            },
            maintainAspectRatio: false, // Permet de contrôler la taille indépendamment du ratio
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;
