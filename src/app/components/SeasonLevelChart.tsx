import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SeasonLevelChart: React.FC<{ filters: any }> = ({ filters }) => {
    const [chartData, setChartData] = useState<any>(null);

    // useEffect pour récupérer les données et mettre à jour l'état chartData
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Construire l'URL avec les filtres
                const queryParams = new URLSearchParams(filters).toString();
                const response = await fetch(`/api/data?action=averagePriceByLevelAndSeason&${queryParams}`);
                if (!response.ok) {
                    throw new Error(`Erreur API : ${response.status}`);
                }
                const data = await response.json();

                // Préparer les données pour le graphique
                const seasons = Object.keys(data); // Saisons comme labels
                const levels = ['pro', 'moyen', 'novice']; // Niveaux à afficher

                // Préparer les datasets pour chaque niveau
                const datasets = levels.map((level, index) => ({
                    label: `Niveau ${level}`, // Libellé de la série
                    data: seasons.map((season) => data[season]?.[level] || 0), // Données de chaque saison pour ce niveau
                    backgroundColor: `rgba(${index * 60 + 100}, ${index * 40 + 80}, 255, 0.7)`, // Couleur de la barre
                    borderColor: `rgba(${index * 60 + 100}, ${index * 40 + 80}, 255, 1)`, // Bordure de la barre
                    borderWidth: 1, // Largeur de la bordure
                }));

                // Mettre à jour l'état avec les données du graphique
                setChartData({
                    labels: seasons, // Labels des saisons
                    datasets, // Données pour chaque niveau
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData(); // Appeler la fonction pour récupérer les données lorsque les filtres changent
    }, [filters]); // Recharger les données lorsque les filtres changent

    // Affichage d'un message de chargement si les données ne sont pas encore disponibles
    if (!chartData) return <p>Chargement...</p>;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                Prix Moyen par Niveau et par Saison
            </h2>
            <Bar
                data={chartData} // Données à afficher dans le graphique
                options={{
                    responsive: true, // Le graphique s'ajuste selon la taille du conteneur
                    plugins: {
                        legend: {
                            position: 'top' as const, // Position de la légende en haut
                            labels: {
                                color: '#4B5563', // Couleur des labels de la légende
                            },
                        },
                        title: {
                            display: true, // Afficher le titre du graphique
                            text: 'Prix moyen des niveaux selon les saisons', // Titre du graphique
                            color: '#1F2937', // Couleur du titre
                            font: {
                                size: 16, // Taille du titre
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#4B5563', // Couleur des ticks sur l'axe X
                            },
                            grid: {
                                color: '#E5E7EB', // Couleur de la grille sur l'axe X
                            },
                        },
                        y: {
                            ticks: {
                                color: '#4B5563', // Couleur des ticks sur l'axe Y
                            },
                            grid: {
                                color: '#E5E7EB', // Couleur de la grille sur l'axe Y
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default SeasonLevelChart;
