// UI Constants for MediGo App
// Standardized styling to maintain consistency across the application

export const COLORS = {
  // Primary brand colors
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundGradient: ['#F8F9FA', '#EDF3F5'],
  backgroundGradientAlt: ['#FFFFFF', '#F0F9FA'],
  
  // Text colors
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textLight: '#A0A0A0',
  white: '#FFFFFF',
  
  // Status colors
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Input and form colors
  inputBg: 'rgba(255, 255, 255, 0.9)',
  inputBgSecondary: '#f5f5f5',
  border: '#E9ECEF',
  borderLight: '#F0F0F0',
  placeholder: '#A0A0A0',
  
  // Button colors
  buttonBlue: '#0099CC',
  buttonBlueDark: '#007BA3',
  buttonGradient: ['#0099CC', '#00B5E2'],
  
  // Shadow and elevation
  shadow: 'rgba(0, 154, 176, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.1)',
  inputShadow: 'rgba(0, 154, 176, 0.1)',
  
  // Emergency colors
  emergency: '#F44336',
  emergencyLight: '#FFEBEE',
  emergencyBorder: '#FFCDD2',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 1000,
};

export const TYPOGRAPHY = {
  // Font sizes
  caption: 12,
  body: 14,
  bodyLarge: 16,
  subtitle: 18,
  title: 20,
  titleLarge: 24,
  headline: 26,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: 'bold' as const,
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const INPUT_STYLES = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: SPACING.lg,
    height: 55,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerSecondary: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.inputBgSecondary,
    paddingHorizontal: SPACING.lg,
    height: 55,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    height: 55,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.bodyLarge,
    fontFamily: 'System',
  },
  icon: {
    marginRight: SPACING.md,
  },
  eyeIcon: {
    padding: SPACING.sm,
  },
};

export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    height: 55,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.medium,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.lg,
    height: 55,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    primary: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.bodyLarge,
      fontWeight: TYPOGRAPHY.semibold,
    },
    secondary: {
      color: COLORS.textPrimary,
      fontSize: TYPOGRAPHY.bodyLarge,
      fontWeight: TYPOGRAPHY.semibold,
    },
  },
};

export const BACK_BUTTON_STYLES = {
  container: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(0, 160, 176, 0.08)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  icon: {
    size: 24,
    color: COLORS.primary,
  },
};

export const CARD_STYLES = {
  container: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.light,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeightNormal * TYPOGRAPHY.body,
  },
};

export const HEADER_STYLES = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    flex: 1,
  },
};

export const SECTION_STYLES = {
  title: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  container: {
    marginBottom: SPACING.xxl,
  },
};

export const LAYOUTS = {
  screenPadding: SPACING.lg,
  sectionSpacing: SPACING.xxl,
  elementSpacing: SPACING.lg,
  minTouchTarget: 44,
}; 