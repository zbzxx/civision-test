'use client';

import { useState, useEffect } from 'react';
import PriceDisplay from '../components/PriceDisplay';
import PieChart from '../components/PieChartSeason';
import SeasonLevelChart from '../components/SeasonLevelChart';
import FilterBar from '../components/FilterBar';
import ProjectInfo from '../components/Presentation';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const newData = await res.json();

        if (!newData || newData.length === 0) {
          throw new Error('No data found');
        }

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  }

  return (
    <div className="min-h-screen bg-[#1D3557] p-8"> {/* Light Gray Background */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Section Price Display et FilterBar - à gauche */}
    <div className="lg:col-span-1 bg-[#F1F1F1] shadow-lg rounded-lg p-6 space-y-6">
      {/* Titre du Dashboard */}
      <ProjectInfo 
      name='Nicolas Werbrouck'
      githubProfile='https://github.com/zbzxx'
      linkedinProfile='https://www.linkedin.com/in/nicolas-werbrouck-952b7a300/'/>

      {/* Affichage du Prix */}
      <PriceDisplay data={data} />

      {/* Filtrage sous la section Price Display */}
      <div className="bg-[#F1F1F1] shadow-lg rounded-lg p-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>
    </div>

    {/* Section Graphiques - à droite */}
    <div className="lg:col-span-2 space-y-8">
      {/* Graphiques */}
      <div className="flex flex-col space-y-4">
        <div className="bg-[#F1F1F1] shadow-lg rounded-lg p-6">
          <PieChart />
        </div>
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
