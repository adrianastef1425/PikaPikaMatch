import { memo } from 'react';
import type { EvaluatedCharacter } from '../../types';

interface RecentlyEvaluatedListProps {
  characters: EvaluatedCharacter[];
}

export const RecentlyEvaluatedList = memo(function RecentlyEvaluatedList({ characters }: RecentlyEvaluatedListProps) {
  const sourceColors = {
    pokemon: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
    rickandmorty: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-300',
    superhero: 'bg-purple-200 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const sourceLabels = {
    pokemon: 'Pokémon',
    rickandmorty: 'Rick & Morty',
    superhero: 'Superhero',
  };

  // Characters are already sorted in reverse chronological order from the API
  // (most recent first)
  
  if (characters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No characters evaluated yet. Start voting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Recently evaluated characters">
      {characters.map((character) => (
        <div
          key={`${character.id}-${character.votedAt}`}
          className="flex items-center gap-3 md:gap-4 p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-soft hover:shadow-card transition-shadow"
          role="listitem"
        >
          {/* Character thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden">
              <img
                src={character.imageUrl}
                alt={`${character.name} - ${sourceLabels[character.source]} character`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Vote badge overlay */}
            <div className="absolute -top-1 -right-1" aria-label={character.vote === 'like' ? 'Liked' : 'Disliked'}>
              {character.vote === 'like' ? (
                <div className="bg-pastel-green rounded-full p-1 shadow-md">
                  <span className="material-symbols-outlined text-green-700 text-sm" aria-hidden="true">
                    favorite
                  </span>
                </div>
              ) : (
                <div className="bg-pastel-red rounded-full p-1 shadow-md">
                  <span className="material-symbols-outlined text-red-700 text-sm" aria-hidden="true">
                    close
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Character info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-sm md:text-base mb-1 truncate">
              {character.name}
            </h4>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                sourceColors[character.source]
              }`}
            >
              {sourceLabels[character.source]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});
