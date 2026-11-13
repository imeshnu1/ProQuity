// Design tokens — ProQuity brand palette (Imperial Bordeaux) and type.
// Change a color here and it changes everywhere in the app.
// Older token names (brand, grey700…) are kept so every screen picks up the new palette.

const palette = {
  // Brand
  // Lightened from #5B1425: a warmer claret that reads as established and trustworthy
  // without the heaviness of near-black red. White text on it still passes WCAG AAA (7:1+).
  imperialBordeaux: '#7A2638', // main buttons, active tabs, highlights
  bordeauxPressed: '#64202F', // button while it's being tapped
  deepBordeaux: '#3E0011', // dark buttons (Connect, Message), profile icon
  roseWash: '#FFE8EC', // soft buttons, tab backgrounds, tags
  lightRose: '#FFF0F2', // info panels, highlighted notes
  roseBorder: '#F3D5DB', // borders on rose panels
  // Accents
  cognacGold: '#B88344', // debt deals, "pending" states
  goldWash: '#FDF8F0',
  forestOlive: '#2D5941', // verified, accepting interest, success
  oliveWash: '#F0F5F2',
  errorRed: '#BA1A1A',
  errorWash: '#FFDAD6',
  // Text
  espressoNoir: '#241418', // headings and main text
  mutedInk: '#544244', // secondary text
  cashmereTaupe: '#8C827A', // labels, small print, icons
  placeholder: '#A39A93',
  // Backgrounds and lines
  warmLinen: '#FAF7F2', // screen background
  white: '#FFFFFF', // cards, inputs, bottom bar
  sand: '#F5F1EB', // icon tiles, neutral panels
  hairline: '#E8E3DC', // card borders, dividers
  strongHairline: '#D9D2C9', // input borders, outlined buttons
};

export const colors = {
  ...palette,
  // Roles used across the screens
  brand: palette.imperialBordeaux,
  brandPressed: palette.bordeauxPressed,
  brandLight: palette.deepBordeaux,
  navyMuted: palette.mutedInk,
  blue: palette.imperialBordeaux, // accent text/links
  blueLight: palette.roseWash, // soft fills
  linkedin: '#0A66C2', // LinkedIn's own brand blue, only on the LinkedIn button

  bg: palette.warmLinen,
  bgDefault: palette.white,
  selected: palette.lightRose, // selected cards, highlighted panels
  chipTint: palette.roseWash,

  grey100: palette.sand,
  grey200: palette.hairline,
  grey300: palette.strongHairline,
  grey400: palette.placeholder,
  grey500: palette.cashmereTaupe,
  grey600: palette.mutedInk,
  grey700: palette.espressoNoir,
  grey900: palette.espressoNoir,

  borderLight: palette.hairline,
  borderMedium: palette.strongHairline,
  borderStroke: palette.roseBorder,
  borderStrong: palette.deepBordeaux,

  disabled: '#CDBABE', // primary button, disabled
  icon: palette.cashmereTaupe,
  onBrand: palette.white,

  success: palette.forestOlive,
  successToast: palette.forestOlive,
  error: palette.errorRed,
  warning: palette.cognacGold,
  accent: palette.forestOlive,
  overlay: 'rgba(36,20,24,0.32)',
  scrim: 'rgba(36,20,24,0.55)',
  webFrame: '#EDE7DF', // area around the phone column on wide web screens
};

export const fonts = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  serif: 'Newsreader-Medium',
  serifSemibold: 'Newsreader-SemiBold',
};

// Text styles: Newsreader for headings, Plus Jakarta Sans for everything else.
export const type = {
  h1: { fontFamily: fonts.serifSemibold, fontSize: 26, lineHeight: 32 },
  h1_1: { fontFamily: fonts.serifSemibold, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 27 },
  h3: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 25 },
  h4: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21 },
  h5: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 19 },
  b1: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  b2: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 21 },
  b3: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18.5 },
  b4: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 17 },
  l1: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  l2: { fontFamily: fonts.medium, fontSize: 13.5, lineHeight: 19.5 },
  l3: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17.5 },
  l4: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16 },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 21 },
  buttonSmall: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
} as const;

export const radius = { sm: 4, md: 8, lg: 10, xl: 14, card: 14, pill: 44, sheet: 24 };
export const space = { gutter: 20 };

export const shadow = {
  card: {
    shadowColor: '#3E0011',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sheet: {
    shadowColor: '#241418',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
};
