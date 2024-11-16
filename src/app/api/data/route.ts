// src/app/api/data/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

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

    // Si l'action est "countBySeason", compter les éléments par saison
    if (action === 'countBySeason') {
     const seasonCount = countElementBySeason(data);
     return NextResponse.json(seasonCount);
    }
    
    return NextResponse.json(data); // Retourner les données sous forme de JSON
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
      seasonCounts[item.saison]++;
    }
  });

  return seasonCounts;
}


