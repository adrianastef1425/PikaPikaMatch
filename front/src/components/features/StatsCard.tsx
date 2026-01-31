import { memo } from 'react';
import { Card } from '../ui/Card';
import type { Character, CharacterStats } from '../../types';

interface StatsCardProps {
  character: Character;
  stats: CharacterStats;
  variant: 'favorite' | 'controversial';
}

export const StatsCard = memo(function StatsCard({ character, stats, variant }: StatsCardProps) {
  const sourceColors = {
    pokemon: 'bg-pastel-yellow text-yellow-900',
    rickandmorty: 'bg-pastel-green text-green-900',
    superhero: 'bg-pastel-red text-red-900',
  };

  const percentage = variant === 'favorite' ? stats.likePercentage : stats.dislikePercentage;
  const badgeLabel = variant === 'favorite' ? 'Community favorite' : 'Most controversial';

  return (
    <Card className="relative flex-shrink-0 w-40 md:w-48 snap-start" role="article" aria-label={`${character.name} statistics`}>
      {/* Badge overlay */}
      <div className="absolute top-2 right-2 z-10" aria-label={badgeLabel}>
        {variant === 'favorite' ? (
          <div className="bg-pastel-green rounded-full p-1.5 md:p-2 shadow-md">
            <span className="material-symbols-outlined text-green-700 text-xl md:text-2xl" aria-hidden="true">
              favorite
            </span>
          </div>
        ) : (
          <div className="bg-pastel-red rounded-full p-1.5 md:p-2 shadow-md">
            <span className="material-symbols-outlined text-red-700 text-xl md:text-2xl" aria-hidden="true">
              close
            </span>
          </div>
        )}
      </div>

      {/* Character thumbnail */}
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={character.imageUrl}
          alt={`${character.name} - ${character.source === 'rickandmorty' ? 'Rick & Morty' : character.source.charAt(0).toUpperCase() + character.source.slice(1)} character`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Character info and stats */}
      <div className="p-3 md:p-4">
        <h3 className="font-display font-bold text-base md:text-lg mb-1 line-clamp-1">
          {character.name}
        </h3>
        
        {/* Type tag */}
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${
            sourceColors[character.source]
          }`}
        >
          {character.source === 'rickandmorty' 
            ? 'Rick & Morty' 
            : character.source.charAt(0).toUpperCase() + character.source.slice(1)}
        </span>

        {/* Statistics */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {variant === 'favorite' ? 'Likes' : 'Dislikes'}
            </span>
            <span className="font-bold text-base md:text-lg" aria-label={`${percentage.toFixed(0)} percent ${variant === 'favorite' ? 'likes' : 'dislikes'}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});
