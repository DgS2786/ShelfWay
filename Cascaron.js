import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, BottomNavigation, Text} from 'react-native-paper';
import { ThemeContextProvider, useTheme } from './assets/Color/ThemeProvider';

function MainScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [index, setIndex] = React.useState(1);
    const [routes] = React.useState([
        { key: 'ofertas', title: 'Ofertas', icon: 'tag-outline' },
        { key: 'mapa', title: 'Mapa', icon: 'map-marker-outline' },
        { key: 'config', title: 'Configuración', icon: 'cog-outline' },
    ]);

    const { theme, toggleThemeType, themeType } = useTheme();

    const renderScene = () => (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Searchbar
                placeholder="Buscar"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.placeholder} 
                inputStyle={{ color: theme.colors.text }}       
                style={[
                    styles.searchbar,
                    { backgroundColor: theme.colors.surface },
                ]}
                iconColor={theme.colors.primary}
            />


            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
                Aqui va todo 
            </Text>

        </View>
    );


    return (
        <View style={{ flex: 1 }}>
            {renderScene()}
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={() => null}
                barStyle={{ backgroundColor: theme.colors.menuBg }}
                activeColor={theme.colors.btIcon}
                inactiveColor={theme.colors.btIconIn}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
                theme={{ colors: { secondaryContainer: theme.colors.activeT } }}
                renderIcon={({ route, focused }) => (
                    <MaterialCommunityIcons
                        name={route.icon}
                        size={24}
                        color={focused ? theme.colors.btIcon : theme.colors.btIconIn}
                    />
                )}
            />
        </View>
    );
}

export default function App() {
    return (
        <ThemeContextProvider>
            <MainScreen />
        </ThemeContextProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
    },
    searchbar: {
        width: '85%',
        marginBottom: 30,
        borderRadius: 20,
    },
});
