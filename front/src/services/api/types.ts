// Backend response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Backend DTOs
export interface CharacterDTO {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
  description: string;
}

export interface VoteRequestDTO {
  characterId: string;
  characterName: string;
  characterSource: string;
  voteType: 'like' | 'dislike';
  imageUrl: string;
  description?: string;
}

export interface VoteResponseDTO {
  voteId: string;
  characterId: string;
  characterName: string;
  characterSource: string;
  imageUrl: string;
  description: string;
  voteType: 'like' | 'dislike';
  timestamp: string;
}

export interface CharacterStatsDTO {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
  description: string;
  totalLikes: number;
  totalDislikes: number;
  totalVotes: number;
  likePercentage: number;
  dislikePercentage: number;
}
