import * as React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Searchbar, BottomNavigation, FAB, Button } from 'react-native-paper';
import { ThemeContextProvider, useTheme } from '../../Resources/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // ⭐ CORREGIDO
import { CameraView, useCameraPermissions } from 'expo-camera';
import TutorialDialog from './TutorialSC';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

function MainScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [index, setIndex] = React.useState(1);
    const [showTutorial, setShowTutorial] = React.useState(false);
    const [routes] = React.useState([
        { key: 'ofertas', title: 'Ofertas', icon: 'tag-outline' },
        { key: 'mapa', title: 'Mapa', icon: 'map-marker-outline' },
        { key: 'config', title: 'Configuración', icon: 'cog-outline' },
    ]);

    const { theme, toggleThemeType, isDarkTheme } = useTheme(); 
    const [permission, requestPermission] = useCameraPermissions();
    const navigation = useNavigation();

    // Adaptatividad: Obtener dimensiones para ajustar la cámara en horizontal
    const { width, height } = Dimensions.get('window');
    const isPortrait = height >= width;

    React.useEffect(() => {
        if (!permission) return;
        if (!permission.granted) requestPermission();
    }, [permission]);

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>No se concedió el permiso de cámara.</Text>
            </View>
        );
    }

    // Lógica para Navegación de Desarrollo
    const navigateToReporte = () => navigation.navigate('Reporte');
    const navigateToPersonalizacion = () => navigation.navigate('Personalizacion');
    const navigateToPreferencias = () => navigation.navigate('Preferencias');
    const navigateToNotificaciones = () => navigation.navigate('Notificaciones'); 
    const navigateToIdioma = () => navigation.navigate('Idioma'); 
    // ⭐ NUEVA FUNCIÓN


    const renderScene = () => (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            
            {/* Botón modo oscuro / claro */}
            <Button
                mode="contained-tonal"
                onPress={toggleThemeType}
                style={{ alignSelf: 'center', marginBottom: 10 }}
            >
                {isDarkTheme ? '☀️ Modo claro' : '🌙 Modo oscuro'}
            </Button>

            {/* BOTONES DE NAVEGACIÓN DE DESARROLLO TEMPORAL */}
            <View style={styles.devButtons}>
                <Button mode="outlined" compact onPress={navigateToReporte}>
                    Reporte
                </Button>
                <Button mode="outlined" compact onPress={navigateToPersonalizacion}>
                    Personaliz.
                </Button>
            </View>
            
            {/* Barra de búsqueda */}
            <Searchbar
                placeholder="Buscar"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.placeholder}
                inputStyle={{ color: theme.colors.text }}
                style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
                iconColor={theme.colors.primary}
                onSubmitEditing={() => {
                    if (searchQuery.trim() !== '') {
                        navigation.navigate('Products', { query: searchQuery });
                    }
                }}
            />

            {/* Cámara y texto */}
            <View style={[styles.cameraWrapper, isPortrait ? styles.cameraWrapperPortrait : styles.cameraWrapperLandscape]}>
                <Text style={[styles.infoText, { color: theme.colors.text }]}>
                    Escanea un QR o código de barras
                </Text>
                <View style={[styles.cameraV, isPortrait ? styles.cameraVPortrait : styles.cameraVLandscape]}>
                    <CameraView style={StyleSheet.absoluteFillObject} />
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Contenido principal */}
            <View style={{ flex: 1 }}>
                {renderScene()}
            </View>

            <StatusBar
                style={isDarkTheme ? 'light' : 'dark'}
                backgroundColor={theme.colors.background}
                translucent={false}
            />


            {/* Botón flotante de ayuda */}
            <FAB
                icon="help-circle-outline"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => setShowTutorial(true)}
            />

            {/* Dialog del tutorial */}
            <TutorialDialog
                visible={showTutorial}
                onDismiss={() => setShowTutorial(false)}
            />

            {/* Navegación inferior */}
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={() => null}
                barStyle={{ backgroundColor: theme.colors.menuBg }}
                activeColor={theme.colors.btIcon}
                inactiveColor={theme.colors.btIconIn}
                style={styles.bottomNav}
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

        <MainScreen />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        justifyContent: 'flex-start',
    },
    // ESTILOS DE DESARROLLO
    devButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '95%', // Aumentamos el ancho para que quepan los 4 botones
        alignSelf: 'center',
        marginBottom: 10,
    },
    searchbar: {
        width: '85%',
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 20,
    },
    infoText: {
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 20,
    },
    cameraWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        // Eliminado: marginTop: '-60%',
    },
    // NUEVOS ESTILOS PARA ADAPTAR CÁMARA
    cameraWrapperPortrait: {
        // En vertical, usa flex para ocupar el espacio restante
    },
    cameraWrapperLandscape: {
        // En horizontal, es más compacto
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    cameraV: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        elevation: 8,
    },
    cameraVPortrait: {
        width: 320,
        aspectRatio: 1, // Cuadrado
    },
    cameraVLandscape: {
        // Reducir el tamaño de la cámara en horizontal para que quepa mejor
        width: Dimensions.get('window').height * 0.5, // 50% de la altura (que es el ancho en landscape)
        aspectRatio: 1,
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 150,
        zIndex: 10,
        elevation: 6,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    permissionText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});