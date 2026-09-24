# Theme System - Skills Documentation

## Overview
The theme system provides Light, Dark, and System (auto) theme support with persistence and OS preference detection.

## Architecture

### Context
- **ThemeContext** (`src/contexts/ThemeContext.tsx`)
- **Provider**: `ThemeProvider`
- **Hook**: `useTheme()`

### Theme Modes
```typescript
type ThemeMode = 'light' | 'dark' | 'system';
```

## Implementation

### Theme Context
```typescript
interface ThemeContextType {
  theme: ThemeMode; // Current theme setting
  setTheme: (theme: ThemeMode) => void; // Change theme
  isDark: boolean; // Computed dark mode state
}
```

### Theme Provider
```typescript
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  // Update theme when changed
  useEffect(() => {
    const root = document.documentElement;
    let shouldBeDark = false;

    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'light') {
      shouldBeDark = false;
    } else {
      // System preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setIsDark(shouldBeDark);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Usage

### In Components
```typescript
import { useTheme } from '../../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className={isDark ? 'dark-mode' : 'light-mode'}>
      <button onClick={() => setTheme('dark')}>
        Dark Mode
      </button>
    </div>
  );
};
```

### Theme Switcher Button
```typescript
import { Brightness4, Brightness7, SettingsBrightness } from '@mui/icons-material';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Brightness7 />;
      case 'dark': return <Brightness4 />;
      case 'system': return <SettingsBrightness />;
    }
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {getIcon()}
    </IconButton>
  );
};
```

## Tailwind Dark Mode

### Configuration
```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // Use 'dark' class on html element
  // ...
};
```

### Dark Mode Classes
```typescript
// Background
<div className="bg-white dark:bg-gray-900">

// Text
<p className="text-gray-900 dark:text-gray-100">

// Borders
<div className="border-gray-300 dark:border-gray-700">

// Hover states
<button className="hover:bg-gray-100 dark:hover:bg-gray-800">
```

## System Preference Detection

### Media Query
```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Listen for changes
mediaQuery.addEventListener('change', (e) => {
  if (theme === 'system') {
    setIsDark(e.matches);
  }
});
```

### Initial Detection
```typescript
const getSystemPreference = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
```

## Persistence

### LocalStorage
```typescript
// Save theme
localStorage.setItem('theme', theme);

// Load theme
const savedTheme = localStorage.getItem('theme') as ThemeMode;
```

### Session Persistence
Theme persists across:
- Page refreshes
- Browser restarts
- Different tabs (same domain)

## Best Practices

### Performance
1. Use CSS variables for smooth transitions
2. Avoid flickering on page load
3. Minimize re-renders
4. Cache theme value

### User Experience
1. Smooth theme transitions
2. Respect system preferences
3. Remember user choice
4. Visual feedback on toggle

### Accessibility
1. Sufficient contrast ratios
2. ARIA labels for theme buttons
3. Keyboard shortcuts (optional)
4. Don't rely on color alone

## CSS Variables Approach

### Define Variables
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

.dark {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```

### Use in Components
```css
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

## Tailwind + MUI Integration

### MUI Theme
```typescript
import { createTheme, ThemeProvider } from '@mui/material';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';

const App = () => {
  const { isDark } = useCustomTheme();

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      {/* App content */}
    </ThemeProvider>
  );
};
```

## Testing

### Test Scenarios
1. Toggle light → dark → system
2. System preference changes
3. Theme persists on reload
4. Multiple tabs sync (optional)
5. Initial load respects saved preference

### Test Code
```typescript
describe('ThemeContext', () => {
  it('should toggle between themes', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should persist theme in localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

## Color Palette

### Light Theme
```typescript
{
  background: '#ffffff',
  surface: '#f5f5f5',
  primary: '#1976d2',
  text: '#000000',
  textSecondary: '#666666',
}
```

### Dark Theme
```typescript
{
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#90caf9',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
}
```

## Transitions

### Smooth Switching
```css
* {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
}
```

### Disable Transitions on Toggle
```typescript
const setTheme = (newTheme: ThemeMode) => {
  // Disable transitions temporarily
  document.documentElement.classList.add('no-transition');
  
  // Update theme
  localStorage.setItem('theme', newTheme);
  setThemeState(newTheme);
  
  // Re-enable transitions
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition');
  }, 0);
};
```

## Future Enhancements

1. **Custom Themes**
   - User-defined colors
   - Multiple theme options
   - Theme marketplace

2. **Auto-switching**
   - Time-based (day/night)
   - Location-based
   - Battery-saving mode

3. **Theme Preview**
   - Live preview before applying
   - Undo/redo

4. **Accessibility**
   - High contrast mode
   - Reduced motion
   - Large text mode

5. **Sync Across Devices**
   - Cloud storage
   - Account-based preferences

## Troubleshooting

### Flash of Wrong Theme
```typescript
// Add to <head>
<script>
  const theme = localStorage.getItem('theme') || 'system';
  if (theme === 'dark' || 
     (theme === 'system' && 
      window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

### Theme Not Persisting
- Check localStorage availability
- Verify localStorage key name
- Check browser permissions

### System Preference Not Working
- Check media query support
- Verify event listener setup
- Test in different browsers
