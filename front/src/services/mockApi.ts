import type { Character, Vote, EvaluatedCharacter, CharacterStats } from '../types';

// Mock character data
const mockCharacters: Character[] = [
  // Pokemon characters
  {
    id: 'poke-1',
    name: 'Pikachu',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    description: 'Pika Pika! A chubby, electric-type Pokémon that stores electricity in its cheeks.',
    source: 'pokemon',
  },
  {
    id: 'poke-2',
    name: 'Charizard',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    description: 'A powerful fire and flying-type Pokémon that breathes intense flames.',
    source: 'pokemon',
  },
  {
    id: 'poke-3',
    name: 'Bulbasaur',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    description: 'A grass and poison-type Pokémon with a plant bulb on its back.',
    source: 'pokemon',
  },
  {
    id: 'poke-4',
    name: 'Squirtle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    description: 'A water-type Pokémon with a tough shell that protects it from attacks.',
    source: 'pokemon',
  },
  {
    id: 'poke-5',
    name: 'Eevee',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    description: 'A normal-type Pokémon with an unstable genetic makeup that can evolve in many ways.',
    source: 'pokemon',
  },
  {
    id: 'poke-6',
    name: 'Mewtwo',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    description: 'A legendary psychic-type Pokémon created through genetic manipulation.',
    source: 'pokemon',
  },
  {
    id: 'poke-7',
    name: 'Snorlax',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    description: 'A normal-type Pokémon known for sleeping and eating constantly.',
    source: 'pokemon',
  },
  {
    id: 'poke-8',
    name: 'Gengar',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    description: 'A ghost and poison-type Pokémon that lurks in shadows and enjoys scaring people.',
    source: 'pokemon',
  },
  
  // Rick and Morty characters
  {
    id: 'ram-1',
    name: 'Rick Sanchez',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    description: 'A genius scientist with a drinking problem who drags his grandson on interdimensional adventures.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-2',
    name: 'Morty Smith',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    description: 'Rick\'s anxious and often reluctant grandson who gets dragged into dangerous adventures.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-3',
    name: 'Summer Smith',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    description: 'Morty\'s older sister who often joins in on the interdimensional chaos.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-4',
    name: 'Beth Smith',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
    description: 'Rick\'s daughter and a horse surgeon dealing with family dysfunction.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-5',
    name: 'Jerry Smith',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
    description: 'Beth\'s insecure husband who often clashes with Rick.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-6',
    name: 'Mr. Meeseeks',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/242.jpeg',
    description: 'A blue creature summoned to complete simple tasks, but existence is pain.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-7',
    name: 'Birdperson',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg',
    description: 'Rick\'s best friend, a bird-like humanoid with a stoic personality.',
    source: 'rickandmorty',
  },
  {
    id: 'ram-8',
    name: 'Pickle Rick',
    imageUrl: 'https://rickandmortyapi.com/api/character/avatar/265.jpeg',
    description: 'Rick transformed into a pickle to avoid family therapy. Funniest thing ever.',
    source: 'rickandmorty',
  },
  
  // Superhero characters
  {
    id: 'hero-1',
    name: 'Spider-Man',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/620-spider-man.jpg',
    description: 'Peter Parker, a teenager with spider-like abilities who fights crime in New York.',
    source: 'superhero',
  },
  {
    id: 'hero-2',
    name: 'Iron Man',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/346-iron-man.jpg',
    description: 'Tony Stark, a genius billionaire who built a high-tech suit of armor.',
    source: 'superhero',
  },
  {
    id: 'hero-3',
    name: 'Batman',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/70-batman.jpg',
    description: 'Bruce Wayne, a vigilante who uses his wealth and detective skills to fight crime.',
    source: 'superhero',
  },
  {
    id: 'hero-4',
    name: 'Wonder Woman',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/720-wonder-woman.jpg',
    description: 'Diana Prince, an Amazonian warrior princess with superhuman strength.',
    source: 'superhero',
  },
  {
    id: 'hero-5',
    name: 'Superman',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/644-superman.jpg',
    description: 'Clark Kent, an alien from Krypton with incredible powers who protects Earth.',
    source: 'superhero',
  },
  {
    id: 'hero-6',
    name: 'Black Widow',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/107-black-widow.jpg',
    description: 'Natasha Romanoff, a highly trained spy and assassin with exceptional combat skills.',
    source: 'superhero',
  },
  {
    id: 'hero-7',
    name: 'Thor',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/659-thor.jpg',
    description: 'The Norse God of Thunder who wields the mighty hammer Mjolnir.',
    source: 'superhero',
  },
  {
    id: 'hero-8',
    name: 'Captain America',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/149-captain-america.jpg',
    description: 'Steve Rogers, a super-soldier enhanced to peak human potential who fights for justice.',
    source: 'superhero',
  },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VOTES: 'pikapikamatch_votes',
  VOTED_CHARACTER_IDS: 'pikapikamatch_voted_ids',
};

// Helper function to simulate network latency
function simulateDelay(min: number = 200, max: number = 500): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Helper function to get votes from localStorage
function getStoredVotes(): Vote[] {
  const stored = localStorage.getItem(STORAGE_KEYS.VOTES);
  return stored ? JSON.parse(stored) : [];
}

// Helper function to save votes to localStorage
function saveVotes(votes: Vote[]): void {
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
}

// Helper function to get voted character IDs
function getVotedCharacterIds(): Set<string> {
  const stored = localStorage.getItem(STORAGE_KEYS.VOTED_CHARACTER_IDS);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Helper function to save voted character IDs
function saveVotedCharacterIds(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEYS.VOTED_CHARACTER_IDS, JSON.stringify(Array.from(ids)));
}

// Mock API Service
export const mockApi = {
  /**
   * Get a random character that hasn't been voted on yet
   */
  async getRandomCharacter(): Promise<Character> {
    await simulateDelay();
    
    const votedIds = getVotedCharacterIds();
    const availableCharacters = mockCharacters.filter(char => !votedIds.has(char.id));
    
    if (availableCharacters.length === 0) {
      // If all characters have been voted on, reset and start over
      localStorage.removeItem(STORAGE_KEYS.VOTED_CHARACTER_IDS);
      localStorage.removeItem(STORAGE_KEYS.VOTES);
      return mockCharacters[Math.floor(Math.random() * mockCharacters.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    return availableCharacters[randomIndex];
  },

  /**
   * Submit a vote for a character
   */
  async submitVote(vote: Vote): Promise<{ success: boolean }> {
    await simulateDelay();
    
    const votes = getStoredVotes();
    votes.push(vote);
    saveVotes(votes);
    
    const votedIds = getVotedCharacterIds();
    votedIds.add(vote.characterId);
    saveVotedCharacterIds(votedIds);
    
    return { success: true };
  },

  /**
   * Get top favorite characters (most liked)
   */
  async getFavorites(limit: number = 3): Promise<CharacterStats[]> {
    await simulateDelay();
    
    const votes = getStoredVotes();
    const statsMap = new Map<string, { likes: number; dislikes: number }>();
    
    // Calculate statistics for each character
    votes.forEach(vote => {
      if (!statsMap.has(vote.characterId)) {
        statsMap.set(vote.characterId, { likes: 0, dislikes: 0 });
      }
      const stats = statsMap.get(vote.characterId)!;
      if (vote.type === 'like') {
        stats.likes++;
      } else {
        stats.dislikes++;
      }
    });
    
    // Convert to CharacterStats array
    const characterStats: CharacterStats[] = Array.from(statsMap.entries()).map(([characterId, stats]) => {
      const totalVotes = stats.likes + stats.dislikes;
      return {
        characterId,
        likes: stats.likes,
        dislikes: stats.dislikes,
        totalVotes,
        likePercentage: totalVotes > 0 ? (stats.likes / totalVotes) * 100 : 0,
        dislikePercentage: totalVotes > 0 ? (stats.dislikes / totalVotes) * 100 : 0,
      };
    });
    
    // Sort by likes (descending) and return top N
    return characterStats
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  },

  /**
   * Get most controversial characters (most disliked)
   */
  async getControversial(limit: number = 2): Promise<CharacterStats[]> {
    await simulateDelay();
    
    const votes = getStoredVotes();
    const statsMap = new Map<string, { likes: number; dislikes: number }>();
    
    // Calculate statistics for each character
    votes.forEach(vote => {
      if (!statsMap.has(vote.characterId)) {
        statsMap.set(vote.characterId, { likes: 0, dislikes: 0 });
      }
      const stats = statsMap.get(vote.characterId)!;
      if (vote.type === 'like') {
        stats.likes++;
      } else {
        stats.dislikes++;
      }
    });
    
    // Convert to CharacterStats array
    const characterStats: CharacterStats[] = Array.from(statsMap.entries()).map(([characterId, stats]) => {
      const totalVotes = stats.likes + stats.dislikes;
      return {
        characterId,
        likes: stats.likes,
        dislikes: stats.dislikes,
        totalVotes,
        likePercentage: totalVotes > 0 ? (stats.likes / totalVotes) * 100 : 0,
        dislikePercentage: totalVotes > 0 ? (stats.dislikes / totalVotes) * 100 : 0,
      };
    });
    
    // Sort by dislikes (descending) and return top N
    return characterStats
      .sort((a, b) => b.dislikes - a.dislikes)
      .slice(0, limit);
  },

  /**
   * Get recently voted characters
   */
  async getRecentVotes(limit: number = 4): Promise<EvaluatedCharacter[]> {
    await simulateDelay();
    
    const votes = getStoredVotes();
    
    // Sort by timestamp (descending) and take the most recent
    const recentVotes = votes
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    // Map votes to EvaluatedCharacter objects
    const evaluatedCharacters: EvaluatedCharacter[] = recentVotes.map(vote => {
      const character = mockCharacters.find(char => char.id === vote.characterId);
      if (!character) {
        throw new Error(`Character with id ${vote.characterId} not found`);
      }
      return {
        ...character,
        vote: vote.type,
        votedAt: vote.timestamp,
      };
    });
    
    return evaluatedCharacters;
  },

  /**
   * Get character by ID (utility function)
   */
  getCharacterById(id: string): Character | undefined {
    return mockCharacters.find(char => char.id === id);
  },

  /**
   * Get all characters (utility function)
   */
  getAllCharacters(): Character[] {
    return [...mockCharacters];
  },
};
