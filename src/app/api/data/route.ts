// src/app/api/data/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface Item {
  prix: number
}

// Fonction pour récupérer les données depuis le fichier JSON
export async function GET(req: Request) {
  try {
    // Utilisation de process.cwd() pour obtenir le répertoire de travail actuel
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'data.json');
    
    // Lire le fichier JSON de manière synchrone
    const fileData = fs.readFileSync(filePath, 'utf-8');
    
    // Parser les données JSON
    const data = JSON.parse(fileData);

    // Récupérer les paramètres de recherche de l'URL
    const {searchParams} = new URL(req.url);

    // Vérifier si l'action est "countBySeason"
    const action = searchParams.get('action');

    switch (action) {
      case 'countBySeason': {
        const seasonCount = countElementBySeason(data);
        return NextResponse.json(seasonCount);
      }

      case 'averagePriceByLevelAndSeason': {
        const averagePrice = calculateAveragePriceByLevelAndSeason(data);
        return NextResponse.json(averagePrice);
      }

      case 'priceList': {
        const priceList = data
          .map((item: Item) => {
            if (item.prix !== undefined) {
              return { prix: item.prix };
            } else {
              return null;
            }
          })
          .filter((item: Item) => item !== null);

        return NextResponse.json(priceList);
      }

      default:
        return NextResponse.json(data);
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

  // Parcourir les données et compter les éléments par saison
  data.forEach((item) => {
    if (item.saison && seasonCounts[item.saison] !== undefined) {
      seasonCounts[item.saison]++
    }
  });

  return seasonCounts;
}

function calculateAveragePriceByLevelAndSeason(data: any[]){
  const seasons = ['été', 'hiver', 'printemps', 'automne'];
  const levels = ['pro','moyen','novice']

  const result: Record<string, Record<string, number>> = {};

  seasons.forEach((season) => {
    result[season] = {}

    levels.forEach((level) =>{
      result[season][level] = 0
    })
  })

  const sums: Record<string, Record<string, number>> = {};
  const counts: Record<string, Record<string, number>> = {};

  // Initialiser les totaux et les compteurs
  seasons.forEach((season) => {
    sums[season] = {}
    counts[season] ={}

    levels.forEach((level) => {
      sums[season][level] =0
      counts[season][level]=0
    })
  })

  // Parcourir les données pour remplir les totaux et les compteurs
  data.forEach((item)=>{
    if(item.saison && item.niveau && item.prix){
      const season = item.saison
      const level = item.niveau

      if (sums[season] && sums[season][level] !== undefined){
        sums[season][level] += item.prix
        counts[season][level]++
      }
    }
  })
  
  // Calculer les moyennes avec arrondi vers le bas à 2 décimales
  seasons.forEach((season)=>{
    levels.forEach((level)=>{
      if (counts[season][level]>0){
        const average = sums[season][level] / counts[season][level];
        result[season][level] = Math.floor(average * 100) / 100;
      }else{
        result[season][level] = 0
      }
    })
  })

  return result
}