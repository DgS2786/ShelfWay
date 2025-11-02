import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const lightTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        ...PaperDefaultTheme.colors,
        primary: '#1976D2',           // Azul más moderno y equilibrado
        accent: '#26A69A',            // Verde agua agradable
        background: '#F4F6FA',
        surface: '#FFFFFF',
        text: '#1E1E1E',
        disabled: '#B0BEC5',
        placeholder: '#9E9E9E',
        backdrop: '#00000080',
        card: '#FFFFFF',
        border: '#E0E0E0',
        notification: '#FF5252',
        menuBg: '#FFFFFF',
        menuText: '#37474F',
        buttonBg: '#1976D2',
        buttonText: '#FFFFF',
        textM: '#1976D2',
        btIcon: '#1a088fff',
        red: '#E53935',
        dialogS: '#FFFFFF',
        btIconIn: '#5f7faaff',   // un poco más gris para no destacar tanto
        inactiveT: '#3e6aa8ff',  // tono más equilibrado con btIconIn
        activeT: '#8aeee444',    // acento algo más saturado para distinguirse

    },
};

const darkTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        ...PaperDefaultTheme.colors,
        primary: '#90CAF9',           // Azul claro suave
        accent: '#80CBC4',            // Verde menta
        background: '#121826',        // Gris azulado oscuro (menos negro)
        surface: '#1F2937',           // Paneles un poco más claros
        text: '#ECEFF1',              // Blanco grisáceo (no puro)
        disabled: '#6B7280',
        placeholder: '#9CA3AF',
        backdrop: '#00000080',
        card: '#1E293B',
        border: '#334155',
        notification: '#FF6B6B',
        menuBg: '#1F2937',            // Ya no negro total
        menuText: '#E0E0E0',
        buttonBg: '#2563EB',          // Azul más vivo
        buttonText: '#FFFFFF',
        textM: '#90CAF9',
        btIcon: '#90CAF9',
        inactiveT: '#99a6b9ff',         // Gris suave
        activeT: '#60A5FA',           // Azul cielo atractivo
        red: '#F87171',
        dialogS: '#1E293B',
        btIconIn: '#5782bbff',
        inactiveT: '#2564b0ff',
        activeT: '#577c9aff',
    },
};

export const ThemeContext = React.createContext({
    theme: lightTheme,
    themeType: 'light',
    isDarkTheme: false,
    setThemeType: () => { },
    toggleThemeType: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
    const [themeType, setThemeType] = useState('light');
    const toggleThemeType = useCallback(
        () => setThemeType(prev => (prev === 'dark' ? 'light' : 'dark')),
        []
    );

    const isDarkTheme = useMemo(() => themeType === 'dark', [themeType]);
    const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);

    return (
        <PaperProvider theme={theme}>
            <ThemeContext.Provider value={{ theme, themeType, isDarkTheme, setThemeType, toggleThemeType }}>
                {children}
            </ThemeContext.Provider>
        </PaperProvider>
    );
};
