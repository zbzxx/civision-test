import { useEffect, useState } from 'react';

const FilterBar: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
    // Déclaration des états pour les filtres : saison, niveau et plage de prix
    const [season, setSeason] = useState<string | null>(null); // Filtre de saison
    const [level, setLevel] = useState<string | null>(null); // Filtre de niveau
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]); // Filtre de plage de prix

    // useEffect pour appeler la fonction de callback dès que les filtres changent
    useEffect(() => {
        // Appel de la fonction onFilterChange pour propager les nouveaux filtres
        onFilterChange({ season, level, priceRange });
    }, [season, level, priceRange]); // L'effet se déclenche à chaque changement de filtre

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtres de Recherche</h2>

            <div className="flex flex-wrap gap-4">
                {/* Filtre par saison */}
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700">Saison</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4DA8A1] focus:ring-[#4DA8A1] sm:text-sm"
                        value={season || ''} // Si 'season' est null, on affiche une chaîne vide
                        onChange={(e) => setSeason(e.target.value || null)} // Met à jour l'état 'season'
                    >
                        <option value="">Toutes les saisons</option>
                        <option value="été">Été</option>
                        <option value="hiver">Hiver</option>
                        <option value="printemps">Printemps</option>
                        <option value="automne">Automne</option>
                    </select>
                </div>

                {/* Filtre par niveau */}
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700">Niveau</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4DA8A1] focus:ring-[#4DA8A1] sm:text-sm"
                        value={level || ''} // Si 'level' est null, on affiche une chaîne vide
                        onChange={(e) => setLevel(e.target.value || null)} // Met à jour l'état 'level'
                    >
                        <option value="">Tous les niveaux</option>
                        <option value="pro">Pro</option>
                        <option value="moyen">Moyen</option>
                        <option value="novice">Novice</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
