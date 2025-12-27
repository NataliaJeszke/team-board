// import { ToggleSwitchPassThroughOptions } from 'primeng/toggleswitch';

// /**
//  * Custom styles for ToggleSwitch with icons in handle
//  * Using PrimeNG 21 design tokens approach
//  */
// export const toggleSwitchStyles: ToggleSwitchPassThroughOptions = {
//   root: {
//     class: [
//       // Base styles
//       'inline-flex',
//       'relative',
//       'align-items-center',
//       'cursor-pointer',
//       'select-none',
//       'w-14', // 56px
//       'h-8', // 32px
//     ],
//   },
  
//   slider: {
//     class: [
//       // Track styles
//       'flex',
//       'items-center',
//       'justify-center',
//       'rounded-full',
//       'transition-all',
//       'duration-300',
//       'ease-in-out',
      
//       // Light mode - blue gradient
//       'bg-gradient-to-r',
//       'from-sky-100',
//       'to-sky-200',
      
//       // Dark mode - slate gradient
//       'dark:from-slate-800',
//       'dark:to-slate-900',
      
//       // Shadow
//       'shadow-inner',
      
//       // Hover
//       'hover:shadow-md',
      
//       // Width and height
//       'w-full',
//       'h-full',
//     ],
//     style: {
//       boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//   },
  
//   handle: {
//     class: [
//       // Handle (kropka) styles
//       'absolute',
//       'flex',
//       'items-center',
//       'justify-center',
//       'rounded-full',
//       'transition-all',
//       'duration-300',
//       'ease-in-out',
      
//       // Size
//       'w-6', // 24px
//       'h-6', // 24px
      
//       // Position - initially left
//       'left-1',
//       'top-1',
      
//       // Background
//       'bg-white',
      
//       // Shadow
//       'shadow-md',
      
//       // Z-index for icon overlay
//       'z-10',
//     ],
//     style: {
//       boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//     },
//   },
// };

// /**
//  * Extended styles with checked state
//  * Apply these styles when isDarkMode === true
//  */
// export const toggleSwitchCheckedStyles: ToggleSwitchPassThroughOptions = {
//   ...toggleSwitchStyles,
  
//   slider: {
//     ...(toggleSwitchStyles.slider as Record<string, any> || {}),
//     class: [
//       ...(toggleSwitchStyles.slider && typeof toggleSwitchStyles.slider === 'object' && 'class' in toggleSwitchStyles.slider ? toggleSwitchStyles.slider['class'] : []),
//       // Checked state - darker gradient
//       'data-[state=checked]:from-slate-700',
//       'data-[state=checked]:to-slate-900',
//       'dark:data-[state=checked]:from-slate-900',
//       'dark:data-[state=checked]:to-indigo-950',
//     ],
//   },
  
//   handle: {
//     ...(typeof toggleSwitchStyles.handle === 'object' ? toggleSwitchStyles.handle : {}),
//     class: [
//       ...( (toggleSwitchStyles.handle as { class?: string[] })?.class || []),
//       // Move handle to right when checked
//       'data-[state=checked]:translate-x-6', // 24px shift
      
//       // Change background when checked
//       'data-[state=checked]:bg-gradient-to-br',
//       'data-[state=checked]:from-indigo-50',
//       'data-[state=checked]:to-indigo-100',
//     ],
//   },
// };

// /**
//  * Design tokens approach - recommended by PrimeNG 21
//  * Use this with [dt] property on the component
//  */
// export const toggleSwitchTokens = {
//   root: {
//     background: 'transparent',
//     borderRadius: '9999px',
//     transitionDuration: '0.3s',
//   },
  
//   slider: {
//     background: '{surface.100}',
//     hoverBackground: '{surface.200}',
//     borderRadius: '9999px',
//     shadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
//   },
  
//   handle: {
//     width: '1.5rem',
//     height: '1.5rem',
//     borderRadius: '50%',
//     background: '#ffffff',
//     hoverBackground: '#ffffff',
//     shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   },
  
//   // Checked state tokens
//   colorScheme: {
//     light: {
//       slider: {
//         background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
//         checkedBackground: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
//       },
//       handle: {
//         background: '#ffffff',
//         checkedBackground: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
//       },
//     },
//     dark: {
//       slider: {
//         background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
//         checkedBackground: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
//       },
//       handle: {
//         background: '#f8fafc',
//         checkedBackground: 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)',
//       },
//     },
//   },
// };

// /**
//  * Icon container styles - position icons inside handle
//  */
// export const iconContainerStyles = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   width: '100%',
//   height: '100%',
//   pointerEvents: 'none' as const,
//   zIndex: 20,
// };

// /**
//  * Icon animation styles
//  */
// export const iconStyles = {
//   sun: {
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     animation: 'sunRotate 20s linear infinite',
//     filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))',
//   },
//   moon: {
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     animation: 'moonFloat 3s ease-in-out infinite',
//     filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.6))',
//   },
// };

// /**
//  * CSS animations (add to global styles or component styles)
//  */
// export const animations = `
// @keyframes sunRotate {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

// @keyframes moonFloat {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-2px); }
// }
// `;