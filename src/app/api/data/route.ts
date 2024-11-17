import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Fonction principale pour récupérer et filtrer les données en fonction des paramètres de la requête
export async function GET(req: Request) {
  try {
    // Récupérer le chemin complet du fichier JSON
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'data.json');
    // Lire le fichier JSON de manière synchrone
    const fileData = fs.readFileSync(filePath, 'utf-8');
    // Parser le contenu du fichier JSON
    const data = JSON.parse(fileData);

    // Extraire les paramètres de recherche de l'URL de la requête
    const { searchParams } = new URL(req.url);

    // Récupérer les filtres de saison et de niveau depuis les paramètres de l'URL
    const seasonFilter = searchParams.get('season') === 'null' ? null : searchParams.get('season');
    const levelFilter = searchParams.get('level') === 'null' ? null : searchParams.get('level');

    // Initialiser la variable contenant les données filtrées
    let filteredData = data;

    // Appliquer le filtre de saison si spécifié
    if (seasonFilter && seasonFilter !== '') {
      filteredData = filteredData.filter((item: any) => item.saison === seasonFilter);
    }

    // Appliquer le filtre de niveau si spécifié
    if (levelFilter) {
      filteredData = filteredData.filter((item: any) => item.niveau === levelFilter);
    }

    // Vérifier l'action demandée via les paramètres de l'URL
    const action = searchParams.get('action');

    // Exécuter l'action correspondante selon la requête
    switch (action) {
      case 'countBySeason': {
        // Compter les éléments par saison
        const seasonCount = countElementBySeason(filteredData);
        return NextResponse.json(seasonCount);
      }

      case 'averagePriceByLevelAndSeason': {
        // Calculer le prix moyen par niveau et saison
        const averagePrice = calculateAveragePriceByLevelAndSeason(filteredData);
        return NextResponse.json(averagePrice);
      }

      case 'priceList': {
        // Créer une liste de prix sans appliquer de filtre
        const priceList = data.map((item: any) => ({ prix: item.prix, saison: item.saison }));
        
        // Calculer les statistiques des prix (total, moyen, et nombre) par saison
        const seasonStats: Record<string, { total: number, average: number, count: number }> = {};
        data.forEach((item: any) => {
          if (!seasonStats[item.saison]) {
            seasonStats[item.saison] = { total: 0, average: 0, count: 0 };
          }
          seasonStats[item.saison].total += item.prix;
          seasonStats[item.saison].count += 1;
        });
      
        // Calculer le prix moyen pour chaque saison
        Object.keys(seasonStats).forEach(season => {
          const stats = seasonStats[season];
          stats.average = stats.count ? stats.total / stats.count : 0;
        });
      
        return NextResponse.json({ priceList, seasonStats });
      }

      default:
        // Retourner les données filtrées si aucune action spécifique n'est demandée
        return NextResponse.json(filteredData);
    }
  } catch (error) {
    // En cas d'erreur, retourner une réponse d'erreur
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Fonction pour compter le nombre d'éléments par saison
function countElementBySeason(data: any[]) {
  const seasonCounts: Record<string, number> = {
    été: 0,
    hiver: 0,
    printemps: 0,
    automne: 0,
  };

  // Compter les occurrences de chaque saison
  data.forEach((item) => {
    if (item.saison && seasonCounts[item.saison] !== undefined) {
      seasonCounts[item.saison]++;
    }
  });

  return seasonCounts;
}

// Fonction pour calculer les prix moyens par niveau et par saison
function calculateAveragePriceByLevelAndSeason(data: any[]) {
  // Définir les saisons et niveaux disponibles
  const seasons = ['été', 'hiver', 'printemps', 'automne'];
  const levels = ['pro', 'moyen', 'novice'];

  // Initialiser des objets pour stocker les sommes et les comptages par saison et niveau
  const result: Record<string, Record<string, number>> = {};
  const sums: Record<string, Record<string, number>> = {};
  const counts: Record<string, Record<string, number>> = {};

  // Initialiser les sommes et les comptages à zéro pour chaque saison et chaque niveau
  seasons.forEach((season) => {
    sums[season] = {};
    counts[season] = {};
    levels.forEach((level) => {
      sums[season][level] = 0;
      counts[season][level] = 0;
    });
  });

  // Calculer les sommes et les comptages des prix par saison et niveau
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

  // Calculer le prix moyen par saison et niveau
  seasons.forEach((season) => {
    result[season] = {};
    levels.forEach((level) => {
      if (counts[season][level] > 0) {
        const average = sums[season][level] / counts[season][level];
        result[season][level] = Math.floor(average * 100) / 100; // Arrondir à 2 décimales
      } else {
        result[season][level] = 0; // Pas de données disponibles pour cette saison et niveau
      }
    });
  });

  return result;
}
