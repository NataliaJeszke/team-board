import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyBlueTheme = definePreset(Aura, {
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
      950: '{blue.950}'
    },
    
    colorScheme: {
      light: {
        primary: {
          color: '{blue.500}',
          inverseColor: '#ffffff',
          hoverColor: '{blue.600}',
          activeColor: '{blue.700}'
        },
        highlight: {
          background: '{blue.50}',
          focusBackground: '{blue.100}',
          color: '{blue.700}',
          focusColor: '{blue.800}'
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
          950: '{zinc.950}'
        }
      },
      dark: {
        primary: {
          color: '{blue.400}',
          inverseColor: '{blue.950}',
          hoverColor: '{blue.300}',
          activeColor: '{blue.200}'
        },
        highlight: {
          background: '{blue.900}',
          focusBackground: '{blue.800}',
          color: '{blue.50}',
          focusColor: '#ffffff'
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
          950: '{slate.950}'
        }
      }
    },
    
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px'
    }
  }
});

export default MyBlueTheme;