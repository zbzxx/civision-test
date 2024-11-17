import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Fonction pour récupérer les données depuis le fichier JSON
export async function GET(req: Request) {
  try {
    // Utilisation de process.cwd() pour obtenir le répertoire de travail actuel
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'data.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    const { searchParams } = new URL(req.url);

    // Récupérer les filtres
    const seasonFilter = searchParams.get('season') === 'null' ? null : searchParams.get('season');
    const levelFilter = searchParams.get('level') === 'null' ? null : searchParams.get('level');
 

    // Appliquer les filtres
    let filteredData = data;

    if (!seasonFilter || seasonFilter === '') {
      filteredData = data
    } else {
      filteredData = filteredData.filter((item: any) => item.saison === seasonFilter);
    }

    if (levelFilter) {
      filteredData = filteredData.filter((item: any) => item.niveau === levelFilter);
    }

    // Vérifier l'action demandée
    const action = searchParams.get('action');

    switch (action) {
      case 'countBySeason': {
        const seasonCount = countElementBySeason(filteredData);
        return NextResponse.json(seasonCount);
      }

      case 'averagePriceByLevelAndSeason': {
        const averagePrice = calculateAveragePriceByLevelAndSeason(filteredData);
        return NextResponse.json(averagePrice);
      }

      case 'priceList': {
        // Utiliser directement toutes les données sans appliquer de filtre
        const priceList = data.map((item: any) => ({ prix: item.prix, saison: item.saison }));
        
        // Calcul du prix total et moyen par saison
        const seasonStats: Record<string, { total: number, average: number, count: number }> = {};
      
        data.forEach((item: any) => {
          if (!seasonStats[item.saison]) {
            seasonStats[item.saison] = { total: 0, average: 0, count: 0 };
          }
          seasonStats[item.saison].total += item.prix;
          seasonStats[item.saison].count += 1;
        });
      
        // Calcul du prix moyen par saison
        Object.keys(seasonStats).forEach(season => {
          const stats = seasonStats[season];
          stats.average = stats.count ? stats.total / stats.count : 0;
        });
      
        return NextResponse.json({ priceList, seasonStats });
      }
      
      

      default:
        return NextResponse.json(filteredData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Fonction pour compter le nombre de données par saison
function countElementBySeason(data: any[]) {
  const seasonCounts: Record<string, number> = {
    été: 0,
    hiver: 0,
    printemps: 0,
    automne: 0,
  };

  data.forEach((item) => {
    if (item.saison && seasonCounts[item.saison] !== undefined) {
      seasonCounts[item.saison]++;
    }
  });

  return seasonCounts;
}

// Fonction pour calculer les prix moyens par niveau et par saison
function calculateAveragePriceByLevelAndSeason(data: any[]) {
  const seasons = ['été', 'hiver', 'printemps', 'automne'];
  const levels = ['pro', 'moyen', 'novice'];

  const result: Record<string, Record<string, number>> = {};

  const sums: Record<string, Record<string, number>> = {};
  const counts: Record<string, Record<string, number>> = {};

  seasons.forEach((season) => {
    sums[season] = {};
    counts[season] = {};
    levels.forEach((level) => {
      sums[season][level] = 0;
      counts[season][level] = 0;
    });
  });

  data.forEach((item) => {
    if (item.saison && item.niveau && item.prix) {
      const season = item.saison;
      const level = item.niveau;
      if (sums[season] && sums[season][level] !== undefined) {
        sums[season][level] += item.prix;
        counts[season][level]++;
      }
    }
  });

  seasons.forEach((season) => {
    result[season] = {};
    levels.forEach((level) => {
      if (counts[season][level] > 0) {
        const average = sums[season][level] / counts[season][level];
        result[season][level] = Math.floor(average * 100) / 100;
      } else {
        result[season][level] = 0;
      }
    });
  });

  return result;
}
