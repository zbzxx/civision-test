'use client';

import { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import PriceDisplay from '../components/PriceDisplay';
// import Chart1 from '../components/Chart1';
// import Chart2 from '../components/Chart2';
import connectToDatabase from '../lib/mongodb';

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
      {/* <FilterBar filters={{}} setFilters={() => {}} /> Si tu n'as plus de filtre, tu peux passer un objet vide */}
      <PriceDisplay data={data} />
      {/* <Chart1 data={data} />
      <Chart2 data={data} /> */}
    </div>
  );
};

export default Dashboard;
