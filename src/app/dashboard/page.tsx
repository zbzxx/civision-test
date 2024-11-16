'use client';

import { useState, useEffect } from 'react';
import PriceDisplay from '../components/PriceDisplay';
import PieChart from '../components/PieChartSeason';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        
        // Vérifie si la réponse est ok (status 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const newData = await res.json();
  
        // Vérifie que la réponse n'est pas vide
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

  return (
    <div>
      <h1>Dashboard</h1>
      <PriceDisplay data={data} />
      <PieChart />
    </div>
  );
};

export default Dashboard;
