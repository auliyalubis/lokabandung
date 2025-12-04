/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Bandung-inspired palette
const tintColorLight = '#8B4513'; // SaddleBrown
const tintColorDark = '#D2B48C'; // Tan

export const Colors = {
  light: {
    text: '#5A5A5A', // DimGray
    background: '#F5F5DC', // Beige
    tint: tintColorLight,
    icon: '#696969', // DimGray
    tabIconDefault: '#A9A9A9', // DarkGray
    tabIconSelected: tintColorLight,
    accent: '#A0522D', // Sienna
    muted: '#D3D3D3', // LightGray
  },
  dark: {
    text: '#D3D3D3', // LightGray
    background: '#363636', // DarkGray
    tint: tintColorDark,
    icon: '#A9A9A9', // DarkGray
    tabIconDefault: '#696969', // DimGray
    tabIconSelected: tintColorDark,
    accent: '#CD853F', // Peru
    muted: '#808080', // Gray
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
