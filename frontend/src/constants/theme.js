// src/constants/theme.js
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Colores primarios
  primary: '#3366FF',
  primaryLight: '#5C85FF',
  primaryDark: '#0041E6',
  
  // Estados
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  
  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: '#757575',
  lightGray: '#D3D3D3',
  darkGray: '#424242',
  
  // Fondos
  background: '#F5F5F5',
  backgroundLight: '#F8F8F8',
};

export const SIZES = {
  // Tamaños globales
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  
  // Tamaños de fuente
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  
  // Dimensiones de la app
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'System', fontSize: SIZES.h1, lineHeight: 36, fontWeight: 'bold' },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, lineHeight: 30, fontWeight: 'bold' },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, lineHeight: 22, fontWeight: 'bold' },
  h4: { fontFamily: 'System', fontSize: SIZES.h4, lineHeight: 20, fontWeight: 'bold' },
  body1: { fontFamily: 'System', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'System', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'System', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'System', fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontFamily: 'System', fontSize: SIZES.body5, lineHeight: 18 },
};