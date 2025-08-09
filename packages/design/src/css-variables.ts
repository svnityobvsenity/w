import { colors, spacing, typography, borderRadius, shadows, zIndex, transitions } from './tokens';

/**
 * CSS Custom Properties (CSS Variables) for design tokens
 * These can be used in CSS files and provide a bridge between design tokens and CSS
 */
export const cssVariables = {
  // Color Variables
  '--color-primary-50': colors.primary[50],
  '--color-primary-100': colors.primary[100],
  '--color-primary-200': colors.primary[200],
  '--color-primary-300': colors.primary[300],
  '--color-primary-400': colors.primary[400],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-primary-700': colors.primary[700],
  '--color-primary-800': colors.primary[800],
  '--color-primary-900': colors.primary[900],
  '--color-primary-950': colors.primary[950],

  '--color-neutral-50': colors.neutral[50],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-800': colors.neutral[800],
  '--color-neutral-900': colors.neutral[900],
  '--color-neutral-950': colors.neutral[950],

  '--color-success-50': colors.success[50],
  '--color-success-100': colors.success[100],
  '--color-success-200': colors.success[200],
  '--color-success-300': colors.success[300],
  '--color-success-400': colors.success[400],
  '--color-success-500': colors.success[500],
  '--color-success-600': colors.success[600],
  '--color-success-700': colors.success[700],
  '--color-success-800': colors.success[800],
  '--color-success-900': colors.success[900],
  '--color-success-950': colors.success[950],

  '--color-warning-50': colors.warning[50],
  '--color-warning-100': colors.warning[100],
  '--color-warning-200': colors.warning[200],
  '--color-warning-300': colors.warning[300],
  '--color-warning-400': colors.warning[400],
  '--color-warning-500': colors.warning[500],
  '--color-warning-600': colors.warning[600],
  '--color-warning-700': colors.warning[700],
  '--color-warning-800': colors.warning[800],
  '--color-warning-900': colors.warning[900],
  '--color-warning-950': colors.warning[950],

  '--color-error-50': colors.error[50],
  '--color-error-100': colors.error[100],
  '--color-error-200': colors.error[200],
  '--color-error-300': colors.error[300],
  '--color-error-400': colors.error[400],
  '--color-error-500': colors.error[500],
  '--color-error-600': colors.error[600],
  '--color-error-700': colors.error[700],
  '--color-error-800': colors.error[800],
  '--color-error-900': colors.error[900],
  '--color-error-950': colors.error[950],

  // Background Colors
  '--color-background-primary': colors.background.primary,
  '--color-background-secondary': colors.background.secondary,
  '--color-background-tertiary': colors.background.tertiary,
  '--color-background-elevated': colors.background.elevated,

  // Surface Colors
  '--color-surface-primary': colors.surface.primary,
  '--color-surface-secondary': colors.surface.secondary,
  '--color-surface-tertiary': colors.surface.tertiary,
  '--color-surface-elevated': colors.surface.elevated,

  // Text Colors
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-tertiary': colors.text.tertiary,
  '--color-text-disabled': colors.text.disabled,
  '--color-text-inverse': colors.text.inverse,

  // Border Colors
  '--color-border-primary': colors.border.primary,
  '--color-border-secondary': colors.border.secondary,
  '--color-border-tertiary': colors.border.tertiary,
  '--color-border-focus': colors.border.focus,

  // Status Colors
  '--color-status-online': colors.status.online,
  '--color-status-idle': colors.status.idle,
  '--color-status-dnd': colors.status.dnd,
  '--color-status-offline': colors.status.offline,

  // Spacing Variables
  '--spacing-0': spacing[0],
  '--spacing-1': spacing[1],
  '--spacing-2': spacing[2],
  '--spacing-3': spacing[3],
  '--spacing-4': spacing[4],
  '--spacing-5': spacing[5],
  '--spacing-6': spacing[6],
  '--spacing-7': spacing[7],
  '--spacing-8': spacing[8],
  '--spacing-9': spacing[9],
  '--spacing-10': spacing[10],
  '--spacing-12': spacing[12],
  '--spacing-14': spacing[14],
  '--spacing-16': spacing[16],
  '--spacing-20': spacing[20],
  '--spacing-24': spacing[24],
  '--spacing-32': spacing[32],
  '--spacing-40': spacing[40],
  '--spacing-48': spacing[48],
  '--spacing-56': spacing[56],
  '--spacing-64': spacing[64],

  // Typography Variables
  '--font-family-sans': typography.fontFamily.sans.join(', '),
  '--font-family-mono': typography.fontFamily.mono.join(', '),

  '--font-size-xs': typography.fontSize.xs,
  '--font-size-sm': typography.fontSize.sm,
  '--font-size-base': typography.fontSize.base,
  '--font-size-lg': typography.fontSize.lg,
  '--font-size-xl': typography.fontSize.xl,
  '--font-size-2xl': typography.fontSize['2xl'],
  '--font-size-3xl': typography.fontSize['3xl'],
  '--font-size-4xl': typography.fontSize['4xl'],
  '--font-size-5xl': typography.fontSize['5xl'],
  '--font-size-6xl': typography.fontSize['6xl'],

  '--font-weight-thin': typography.fontWeight.thin,
  '--font-weight-extralight': typography.fontWeight.extralight,
  '--font-weight-light': typography.fontWeight.light,
  '--font-weight-normal': typography.fontWeight.normal,
  '--font-weight-medium': typography.fontWeight.medium,
  '--font-weight-semibold': typography.fontWeight.semibold,
  '--font-weight-bold': typography.fontWeight.bold,
  '--font-weight-extrabold': typography.fontWeight.extrabold,
  '--font-weight-black': typography.fontWeight.black,

  '--line-height-none': typography.lineHeight.none,
  '--line-height-tight': typography.lineHeight.tight,
  '--line-height-snug': typography.lineHeight.snug,
  '--line-height-normal': typography.lineHeight.normal,
  '--line-height-relaxed': typography.lineHeight.relaxed,
  '--line-height-loose': typography.lineHeight.loose,

  '--letter-spacing-tighter': typography.letterSpacing.tighter,
  '--letter-spacing-tight': typography.letterSpacing.tight,
  '--letter-spacing-normal': typography.letterSpacing.normal,
  '--letter-spacing-wide': typography.letterSpacing.wide,
  '--letter-spacing-wider': typography.letterSpacing.wider,
  '--letter-spacing-widest': typography.letterSpacing.widest,

  // Border Radius Variables
  '--border-radius-none': borderRadius.none,
  '--border-radius-sm': borderRadius.sm,
  '--border-radius-base': borderRadius.base,
  '--border-radius-md': borderRadius.md,
  '--border-radius-lg': borderRadius.lg,
  '--border-radius-xl': borderRadius.xl,
  '--border-radius-2xl': borderRadius['2xl'],
  '--border-radius-3xl': borderRadius['3xl'],
  '--border-radius-full': borderRadius.full,

  // Shadow Variables
  '--shadow-none': shadows.none,
  '--shadow-sm': shadows.sm,
  '--shadow-base': shadows.base,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--shadow-2xl': shadows['2xl'],
  '--shadow-inner': shadows.inner,

  // Z-Index Variables
  '--z-index-hide': zIndex.hide.toString(),
  '--z-index-base': zIndex.base.toString(),
  '--z-index-docked': zIndex.docked.toString(),
  '--z-index-dropdown': zIndex.dropdown.toString(),
  '--z-index-sticky': zIndex.sticky.toString(),
  '--z-index-banner': zIndex.banner.toString(),
  '--z-index-overlay': zIndex.overlay.toString(),
  '--z-index-modal': zIndex.modal.toString(),
  '--z-index-popover': zIndex.popover.toString(),
  '--z-index-skip-link': zIndex.skipLink.toString(),
  '--z-index-toast': zIndex.toast.toString(),
  '--z-index-tooltip': zIndex.tooltip.toString(),

  // Transition Variables
  '--transition-duration-fast': transitions.duration.fast,
  '--transition-duration-normal': transitions.duration.normal,
  '--transition-duration-slow': transitions.duration.slow,

  '--transition-easing-ease': transitions.easing.ease,
  '--transition-easing-ease-in': transitions.easing.easeIn,
  '--transition-easing-ease-out': transitions.easing.easeOut,
  '--transition-easing-ease-in-out': transitions.easing.easeInOut,
} as const;

/**
 * Generates CSS custom properties string for use in CSS files
 */
export function generateCSSVariables(): string {
  return Object.entries(cssVariables)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n  ');
}

/**
 * Generates CSS custom properties object for use in JavaScript/TypeScript
 */
export function getCSSVariables(): Record<string, string> {
  return cssVariables;
}
