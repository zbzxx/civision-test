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
    
    return NextResponse.json(data); // Retourner les données sous forme de JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
