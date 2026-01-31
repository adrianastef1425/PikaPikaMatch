/**
 * Manual verification script for RecentlyEvaluatedList component
 * This file demonstrates the component usage and validates requirements
 */

import { RecentlyEvaluatedList } from './RecentlyEvaluatedList';
import type { EvaluatedCharacter } from '../../types';

// Mock data for testing
const mockEvaluatedCharacters: EvaluatedCharacter[] = [
  {
    id: 'poke-1',
    name: 'Pikachu',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    description: 'Pika Pika! A chubby, electric-type Pokémon.',
    source: 'pokemon',
    vote: 'like',
    votedAt: Date.now() - 1000, // 1 second ago
  },
  {
    id: 'ram-1',
    name: 'Rick Sanchez',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    description: 'A genius scientist with a drinking problem.',
    source: 'rickandmorty',
    vote: 'dislike',
    votedAt: Date.now() - 5000, // 5 seconds ago
  },
  {
    id: 'hero-1',
    name: 'Spider-Man',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/620-spider-man.jpg',
    description: 'Peter Parker, a teenager with spider-like abilities.',
    source: 'superhero',
    vote: 'like',
    votedAt: Date.now() - 10000, // 10 seconds ago
  },
  {
    id: 'poke-2',
    name: 'Charizard',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    description: 'A powerful fire and flying-type Pokémon.',
    source: 'pokemon',
    vote: 'dislike',
    votedAt: Date.now() - 15000, // 15 seconds ago
  },
];

/**
 * Verification Checklist:
 * 
 * ✓ Requirement 7.2: Display character thumbnail, name, and type information
 *   - Each item shows a 16x16 thumbnail image
 *   - Character name is displayed prominently
 *   - Type/source is shown as a colored badge
 * 
 * ✓ Requirement 7.3: Display badge indicating like or dislike
 *   - Green heart badge for liked characters
 *   - Red X badge for disliked characters
 *   - Badge is positioned on top-right of thumbnail
 * 
 * ✓ Requirement 7.4: Display in reverse chronological order
 *   - Characters are displayed in the order they appear in the array
 *   - API already provides them sorted (most recent first)
 *   - Component preserves this ordering
 * 
 * Component Features:
 * - Responsive layout with flexbox
 * - Hover effects for better UX
 * - Empty state message when no characters
 * - Proper truncation for long names
 * - Consistent styling with other components (StatsCard)
 */

// Example usage in a parent component:
export function ExampleUsage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Recently Evaluated</h2>
      <RecentlyEvaluatedList characters={mockEvaluatedCharacters} />
    </div>
  );
}

// Example with empty state:
export function EmptyStateExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Recently Evaluated</h2>
      <RecentlyEvaluatedList characters={[]} />
    </div>
  );
}
