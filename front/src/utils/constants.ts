export const DESIGN_TOKENS = {
  spacing: {
    cardPadding: '1.5rem',
    sectionGap: '2rem',
    buttonGap: '3rem'
  },
  timing: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  aspectRatio: {
    card: '4/5'
  }
} as const;

export const ROUTES = {
  SPLASH: '/',
  VOTING: '/vote',
  DEX: '/dex'
} as const;

export const ANIMATION_DURATION = {
  SPLASH_SCREEN: 2000,
  BUTTON_HOVER: 150,
  BUTTON_ACTIVE: 100,
  CARD_TRANSITION: 300,
  VOTE_ANIMATION: 500
} as const;
