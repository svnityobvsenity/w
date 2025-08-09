import { colors, spacing, typography, borderRadius, shadows, zIndex, transitions, breakpoints } from './tokens';

/**
 * Tailwind CSS configuration that maps to our design tokens
 * This ensures consistency between our design system and utility classes
 */
export const tailwindConfig = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../apps/**/*.{js,ts,jsx,tsx}',
    '../../packages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: colors.primary[50],
          100: colors.primary[100],
          200: colors.primary[200],
          300: colors.primary[300],
          400: colors.primary[400],
          500: colors.primary[500],
          600: colors.primary[600],
          700: colors.primary[700],
          800: colors.primary[800],
          900: colors.primary[900],
          950: colors.primary[950],
        },
        
        // Neutral Colors
        neutral: {
          50: colors.neutral[50],
          100: colors.neutral[100],
          200: colors.neutral[200],
          300: colors.neutral[300],
          400: colors.neutral[400],
          500: colors.neutral[500],
          600: colors.neutral[600],
          700: colors.neutral[700],
          800: colors.neutral[800],
          900: colors.neutral[900],
          950: colors.neutral[950],
        },
        
        // Semantic Colors
        success: {
          50: colors.success[50],
          100: colors.success[100],
          200: colors.success[200],
          300: colors.success[300],
          400: colors.success[400],
          500: colors.success[500],
          600: colors.success[600],
          700: colors.success[700],
          800: colors.success[800],
          900: colors.success[900],
          950: colors.success[950],
        },
        
        warning: {
          50: colors.warning[50],
          100: colors.warning[100],
          200: colors.warning[200],
          300: colors.warning[300],
          400: colors.warning[400],
          500: colors.warning[500],
          600: colors.warning[600],
          700: colors.warning[700],
          800: colors.warning[800],
          900: colors.warning[900],
          950: colors.warning[950],
        },
        
        error: {
          50: colors.error[50],
          100: colors.error[100],
          200: colors.error[200],
          300: colors.error[300],
          400: colors.error[400],
          500: colors.error[500],
          600: colors.error[600],
          700: colors.error[700],
          800: colors.error[800],
          900: colors.error[900],
          950: colors.error[950],
        },
        
        // Background Colors
        background: {
          primary: colors.background.primary,
          secondary: colors.background.secondary,
          tertiary: colors.background.tertiary,
          elevated: colors.background.elevated,
        },
        
        // Surface Colors
        surface: {
          primary: colors.surface.primary,
          secondary: colors.surface.secondary,
          tertiary: colors.surface.tertiary,
          elevated: colors.surface.elevated,
        },
        
        // Text Colors
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          tertiary: colors.text.tertiary,
          disabled: colors.text.disabled,
          inverse: colors.text.inverse,
        },
        
        // Border Colors
        border: {
          primary: colors.border.primary,
          secondary: colors.border.secondary,
          tertiary: colors.border.tertiary,
          focus: colors.border.focus,
        },
        
        // Status Colors
        status: {
          online: colors.status.online,
          idle: colors.status.idle,
          dnd: colors.status.dnd,
          offline: colors.status.offline,
        },
      },
      
      spacing: {
        // Map spacing tokens to Tailwind spacing scale
        '0': spacing[0],
        '1': spacing[1],
        '2': spacing[2],
        '3': spacing[3],
        '4': spacing[4],
        '5': spacing[5],
        '6': spacing[6],
        '7': spacing[7],
        '8': spacing[8],
        '9': spacing[9],
        '10': spacing[10],
        '12': spacing[12],
        '14': spacing[14],
        '16': spacing[16],
        '20': spacing[20],
        '24': spacing[24],
        '32': spacing[32],
        '40': spacing[40],
        '48': spacing[48],
        '56': spacing[56],
        '64': spacing[64],
      },
      
      fontFamily: {
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },
      
      fontSize: {
        xs: typography.fontSize.xs,
        sm: typography.fontSize.sm,
        base: typography.fontSize.base,
        lg: typography.fontSize.lg,
        xl: typography.fontSize.xl,
        '2xl': typography.fontSize['2xl'],
        '3xl': typography.fontSize['3xl'],
        '4xl': typography.fontSize['4xl'],
        '5xl': typography.fontSize['5xl'],
        '6xl': typography.fontSize['6xl'],
      },
      
      fontWeight: {
        thin: typography.fontWeight.thin,
        extralight: typography.fontWeight.extralight,
        light: typography.fontWeight.light,
        normal: typography.fontWeight.normal,
        medium: typography.fontWeight.medium,
        semibold: typography.fontWeight.semibold,
        bold: typography.fontWeight.bold,
        extrabold: typography.fontWeight.extrabold,
        black: typography.fontWeight.black,
      },
      
      lineHeight: {
        none: typography.lineHeight.none,
        tight: typography.lineHeight.tight,
        snug: typography.lineHeight.snug,
        normal: typography.lineHeight.normal,
        relaxed: typography.lineHeight.relaxed,
        loose: typography.lineHeight.loose,
      },
      
      letterSpacing: {
        tighter: typography.letterSpacing.tighter,
        tight: typography.letterSpacing.tight,
        normal: typography.letterSpacing.normal,
        wide: typography.letterSpacing.wide,
        wider: typography.letterSpacing.wider,
        widest: typography.letterSpacing.widest,
      },
      
      borderRadius: {
        none: borderRadius.none,
        sm: borderRadius.sm,
        base: borderRadius.base,
        md: borderRadius.md,
        lg: borderRadius.lg,
        xl: borderRadius.xl,
        '2xl': borderRadius['2xl'],
        '3xl': borderRadius['3xl'],
        full: borderRadius.full,
      },
      
      boxShadow: {
        none: shadows.none,
        sm: shadows.sm,
        base: shadows.base,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        '2xl': shadows['2xl'],
        inner: shadows.inner,
      },
      
      zIndex: {
        hide: zIndex.hide.toString(),
        base: zIndex.base.toString(),
        docked: zIndex.docked.toString(),
        dropdown: zIndex.dropdown.toString(),
        sticky: zIndex.sticky.toString(),
        banner: zIndex.banner.toString(),
        overlay: zIndex.overlay.toString(),
        modal: zIndex.modal.toString(),
        popover: zIndex.popover.toString(),
        'skip-link': zIndex.skipLink.toString(),
        toast: zIndex.toast.toString(),
        tooltip: zIndex.tooltip.toString(),
      },
      
      transitionDuration: {
        fast: transitions.duration.fast,
        normal: transitions.duration.normal,
        slow: transitions.duration.slow,
      },
      
      transitionTimingFunction: {
        ease: transitions.easing.ease,
        'ease-in': transitions.easing.easeIn,
        'ease-out': transitions.easing.easeOut,
        'ease-in-out': transitions.easing.easeInOut,
      },
      
      screens: {
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        '2xl': breakpoints['2xl'],
      },
      
      // Custom component-specific utilities
      height: {
        'button-sm': spacing[8],
        'button-md': spacing[10],
        'button-lg': spacing[12],
        'input': spacing[10],
      },
      
      padding: {
        'button-sm': `${spacing[2]} ${spacing[4]}`,
        'button-md': `${spacing[3]} ${spacing[6]}`,
        'button-lg': `${spacing[4]} ${spacing[8]}`,
        'input': `${spacing[3]} ${spacing[4]}`,
        'card': spacing[6],
        'modal': spacing[8],
      },
      
      maxWidth: {
        'modal': '500px',
      },
    },
  },
  
  plugins: [
    // Custom plugin for component-specific utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.bg-background-primary': {
          backgroundColor: theme('colors.background.primary'),
        },
        '.bg-background-secondary': {
          backgroundColor: theme('colors.background.secondary'),
        },
        '.bg-background-tertiary': {
          backgroundColor: theme('colors.background.tertiary'),
        },
        '.bg-surface-primary': {
          backgroundColor: theme('colors.surface.primary'),
        },
        '.bg-surface-secondary': {
          backgroundColor: theme('colors.surface.secondary'),
        },
        '.text-text-primary': {
          color: theme('colors.text.primary'),
        },
        '.text-text-secondary': {
          color: theme('colors.text.secondary'),
        },
        '.border-border-primary': {
          borderColor: theme('colors.border.primary'),
        },
        '.border-border-focus': {
          borderColor: theme('colors.border.focus'),
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};

export default tailwindConfig;
