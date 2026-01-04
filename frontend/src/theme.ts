import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

export const MyBlueTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },

    colorScheme: {
      light: {
        primary: {
          color: '{blue.500}',
          contrastColor: '#ffffff',
          hoverColor: '{blue.600}',
          activeColor: '{blue.700}',
        },
        highlight: {
          background: '{blue.50}',
          focusBackground: '{blue.100}',
          color: '{blue.700}',
          focusColor: '{blue.800}',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
        header: {
          background: '{surface.0}',
          borderColor: '{surface.200}',
        },
        content: {
          background: '{surface.50}',
        },
      },
      dark: {
        primary: {
          color: '{blue.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{blue.300}',
          activeColor: '{blue.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {blue.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {blue.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
        header: {
          background: '{surface.800}',
          borderColor: '{surface.700}',
        },
        content: {
          background: '{surface.900}',
        },
      },
    },
  },
  components: {
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
          },
        },
        dark: {
          root: {
            background: '{surface.800}',
          },
        },
      },
    },
  },
});

export default MyBlueTheme;
