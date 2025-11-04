import * as React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import CustomAppbar from '../../components/CustomAppbar'
import PersonalizacionButton from '../../components/PersonalizacionButton'; 
import { useNavigation } from '@react-navigation/native';
import { useTheme as useAppTheme } from '../../Resources/ThemeProvider'; // ⭐ Importar ThemeProvider

function PersonalizacionScreen() {
    const paperTheme = useTheme(); 
    // ⭐ Extraemos i18n para la traducción
    const { theme, i18n } = useAppTheme(); 
    const navigation = useNavigation();

    // ⭐ FUNCIONES DE NAVEGACIÓN ACTIVADAS
    const goToPreferencias = () => { 
        navigation.navigate('Preferencias'); 
    };
    const goToNotificaciones = () => { 
        navigation.navigate('Notificaciones'); 
    };
    const goToIdioma = () => { 
        navigation.navigate('Idioma'); 
    };

    // Usamos theme.baseFontSize para escalar los tamaños
    const baseSize = theme.baseFontSize || 16; 
    const titleSize = baseSize + 2;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: paperTheme.colors.background }]}>
            <StatusBar style="light" backgroundColor={paperTheme.colors.primary} />
            
            {/* ⭐ Usamos el título traducido */}
            <CustomAppbar title={i18n.header_title_preferences} />

            {/* Este contenedor es 100% adaptable */}
            <View style={styles.contentContainer}> 
                <PersonalizacionButton
                    // ⭐ Título traducido
                    title={i18n.header_title_preferences}
                    iconName="tune"
                    onPress={goToPreferencias}
                />
                <PersonalizacionButton
                    // ⭐ Título traducido
                    title={i18n.header_title_notifications}
                    iconName="bell-outline"
                    onPress={goToNotificaciones}
                />
                <PersonalizacionButton
                    // ⭐ Título traducido
                    title={i18n.header_title_language}
                    iconName="web"
                    onPress={goToIdioma}
                />
            </View>
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1, // ⭐ Clave de la adaptabilidad
    },
    contentContainer: {
        flex: 1, // ⭐ Clave de la adaptabilidad
        justifyContent: 'center', 
        alignItems: 'center',    
        paddingHorizontal: 20,
    },
});

export default PersonalizacionScreen;