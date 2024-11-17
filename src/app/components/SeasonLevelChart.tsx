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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SeasonLevelChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data?action=averagePriceByLevelAndSeason');
                if (!response.ok) {
                    throw new Error(`Erreur API : ${response.status}`);
                }
                const data = await response.json();

                // Préparer les données pour le graphique
                const seasons = Object.keys(data); // Saisons comme labels
                const levels = ['pro', 'moyen', 'novice'];

                const datasets = levels.map((level, index) => ({
                    label: `Niveau ${level}`,
                    data: seasons.map((season) => data[season]?.[level] || 0), // Données par saison
                    backgroundColor: `rgba(${index * 60 + 100}, ${index * 40 + 80}, 255, 0.6)`,
                    borderColor: `rgba(${index * 60 + 100}, ${index * 40 + 80}, 255, 1)`,
                    borderWidth: 1,
                }));

                setChartData({
                    labels: seasons,
                    datasets,
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, []);

    if (!chartData) return <p>Chargement...</p>;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                Prix Moyen par Niveau et par Saison
            </h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' as const,
                            labels: {
                                color: '#4B5563',
                            },
                        },
                        title: {
                            display: true,
                            text: 'Prix moyen des niveaux selon les saisons',
                            color: '#1F2937',
                            font: {
                                size: 16,
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#4B5563',
                            },
                            grid: {
                                color: '#E5E7EB',
                            },
                        },
                        y: {
                            ticks: {
                                color: '#4B5563',
                            },
                            grid: {
                                color: '#E5E7EB',
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default SeasonLevelChart;
