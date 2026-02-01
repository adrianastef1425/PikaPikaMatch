const getBaseURL = (): string => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  
  if (envURL) {
    return envURL.endsWith('/') ? envURL.slice(0, -1) : envURL;
  }
  
  return 'http://localhost:8080/api';
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds
  retryAttempts: 2,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  characters: {
    random: '/characters/random',
    pikachu: '/characters/pikachu',
  },
  votes: {
    create: '/votes',
    recent: '/votes/recent',
    last: '/votes/last',
  },
  stats: {
    mostLiked: '/stats/most-liked',
    mostDisliked: '/stats/most-disliked',
    topLiked: '/stats/top-liked',
    topDisliked: '/stats/top-disliked',
  },
} as const;
