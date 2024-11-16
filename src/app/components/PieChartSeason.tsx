import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données depuis l'API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data?action=countBySeason');
        const data = await response.json();

        // Préparer les données pour le graphique
        setChartData({
          labels: ['Été', 'Hiver', 'Printemps', 'Automne'],
          datasets: [
            {
              label: 'Nombre d\'éléments',
              data: [data.été, data.hiver, data.printemps, data.automne],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Rouge
                'rgba(54, 162, 235, 0.6)', // Bleu
                'rgba(75, 192, 192, 0.6)', // Vert
                'rgba(255, 206, 86, 0.6)', // Jaune
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

  // Affiche un message si les données ne sont pas encore chargées
  if (!chartData) return <p>Chargement...</p>;

  return <Pie data={chartData} />;
};

export default PieChart;
