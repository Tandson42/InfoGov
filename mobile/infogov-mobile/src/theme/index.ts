/**
 * Tema da aplicação
 * 
 * Cores, espaçamentos e estilos globais
 * Baseado em design system para aplicações governamentais
 */

export const colors = {
  // Cores primárias (azul institucional governamental - mais sóbrio)
  primary: {
    main: '#0F4C75',      // Azul institucional escuro e sóbrio
    light: '#3282B8',     // Azul médio
    dark: '#0A3A5C',      // Azul muito escuro
    contrastText: '#FFFFFF',
  },

  // Cores secundárias (verde governamental)
  secondary: {
    main: '#2D5016',      // Verde escuro e sóbrio
    light: '#4A7C2F',
    dark: '#1F350F',
    contrastText: '#FFFFFF',
  },

  // Tons de cinza
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Estados
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },

  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },

  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },

  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },

  // Backgrounds (tons mais neutros e profissionais)
  background: {
    default: '#F5F7FA',    // Cinza muito claro com leve tom azulado
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
    subtle: '#F0F2F5',     // Para áreas destacadas
  },

  // Textos
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    hint: '#D1D5DB',
  },

  // Divisores
  divider: '#E5E7EB',

  // Papéis (RBAC)
  role: {
    administrador: '#DC2626',
    servidor: '#2563EB',
    cidadao: '#059669',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
};

export type Theme = typeof theme;

export default theme;
