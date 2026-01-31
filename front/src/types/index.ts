export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  source: 'pokemon' | 'rickandmorty' | 'superhero';
}

export interface Vote {
  characterId: string;
  type: 'like' | 'dislike';
  timestamp: number;
}

export interface EvaluatedCharacter extends Character {
  vote: 'like' | 'dislike';
  votedAt: number;
}

export interface CharacterStats {
  characterId: string;
  likes: number;
  dislikes: number;
  totalVotes: number;
  likePercentage: number;
  dislikePercentage: number;
}

export interface VotingState {
  currentCharacter: Character | null;
  votedCharacters: EvaluatedCharacter[];
  isLoading: boolean;
  error: string | null;
}
