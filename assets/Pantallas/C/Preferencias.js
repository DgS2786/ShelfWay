import * as React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, Pressable } from 'react-native';
import { useTheme, RadioButton, Divider } from 'react-native-paper'; 
import { StatusBar } from 'expo-status-bar';

// ⭐ Importamos el Slider de la comunidad
import Slider from '@react-native-community/slider'; 

import CustomAppbar from '../../components/CustomAppbar';
import { useTheme as useAppTheme } from '../../Resources/ThemeProvider'; 

// Mapeo de valores del slider a un tamaño de fuente base para la previsualización
// NOTA: Esto es solo para la previsualización del texto. El escalado real de la aplicación
// proviene de theme.baseFontSize en el contexto.
const FONT_SCALES = {
    0: 14, // CH (Small)
    1: 16, // M (Medium, default)
    2: 18, // G (Large)
};

function PreferenciasScreen() {
    const paperTheme = useTheme(); 
    // ⭐ EXTRAEMOS i18n para la traducción, y los valores del slider
    const { theme, toggleThemeType, isDarkTheme, fontSizeScale, setFontSizeScale, i18n } = useAppTheme(); 

    // Usamos el valor global del tema para sincronizar el estado local de los RadioButtons
    const [checkedTheme, setCheckedTheme] = React.useState(isDarkTheme ? 'oscuro' : 'claro');
    
    // ⭐ El valor del slider siempre lee el valor global (fontSizeScale)

    React.useEffect(() => {
        // Lógica para aplicar el cambio de tema CLARO/OSCURO globalmente
        if (checkedTheme === 'oscuro' && !isDarkTheme) {
            toggleThemeType();
        } else if (checkedTheme === 'claro' && isDarkTheme) {
            toggleThemeType();
        }
    }, [checkedTheme, isDarkTheme, toggleThemeType]);


    // ⭐ ADAPTATIVIDAD: Usamos Dimensions para detectar la orientación
    const { width, height } = Dimensions.get('window');
    const isPortrait = height >= width;

    // Etiquetas para el Slider
    const sizeLabels = [
        { label: 'CH', value: 0 },
        { label: 'M', value: 1 },
        { label: 'G', value: 2 },
    ];
    
    // Función para determinar el color de la etiqueta (usa el valor global)
    const getLabelColor = (value) => value === fontSizeScale ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant;

    // Función para manejar el movimiento en tiempo real (el valor del slider se actualiza solo)
    const handleSliding = (newValue) => {
        // No hay necesidad de estado local de borrador si usamos el estado global directamente
    };

    // Función para manejar cuando se suelta el pulgar (actualiza el valor final)
    const handleSlidingComplete = (newValue) => {
        const discreteValue = Math.round(newValue);
        
        // ⭐ LLAMADA CLAVE: Actualiza el contexto global, cambiando la fuente de toda la app
        setFontSizeScale(discreteValue);
    };

    // Usamos theme.baseFontSize para escalar los tamaños
    const baseSize = theme.baseFontSize || 16;
    const titleSize = baseSize + 2;
    const subtitleSize = baseSize - 2;
    const labelSize = baseSize;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: paperTheme.colors.background }]}>
            <StatusBar style="light" backgroundColor={paperTheme.colors.primary} />
            
            {/* ⭐ Título traducido */}
            <CustomAppbar title={i18n.header_title_preferences} />

            <ScrollView 
                // ⭐ Adaptatividad en ScrollView: Ajusta el padding horizontal en modo horizontal
                contentContainerStyle={[
                    styles.scrollContent, 
                    !isPortrait && styles.scrollContentLandscape 
                ]}
                style={styles.scrollView}
            >
                {/* Sección TEMA */}
                <View style={styles.sectionContainer}>
                    {/* ⭐ Textos traducidos y escalados */}
                    <Text style={[styles.sectionTitle, { 
                        color: paperTheme.colors.text, 
                        fontSize: titleSize 
                    }]}>{i18n.theme_title}</Text>
                    <Text style={[styles.sectionSubtitle, { 
                        color: paperTheme.colors.onSurfaceVariant,
                        fontSize: subtitleSize
                    }]}>{i18n.theme_description}</Text>
                    <Divider style={styles.divider} />

                    <RadioButton.Group onValueChange={newValue => setCheckedTheme(newValue)} value={checkedTheme}>
                        <View style={styles.radioButtonContainer}>
                            <Text style={[styles.radioButtonLabel, { 
                                color: paperTheme.colors.text,
                                fontSize: labelSize
                            }]}>{i18n.theme_light}</Text>
                            <RadioButton value="claro" color={paperTheme.colors.primary} />
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <Text style={[styles.radioButtonLabel, { 
                                color: paperTheme.colors.text,
                                fontSize: labelSize
                            }]}>{i18n.theme_dark}</Text>
                            <RadioButton value="oscuro" color={paperTheme.colors.primary} />
                        </View>
                    </RadioButton.Group>
                </View>

                {/* Sección TAMAÑO LETRA (Slider real) */}
                <View style={[styles.sectionContainer, styles.fontSizeSection]}>
                    {/* ⭐ Textos traducidos y escalados */}
                    <Text style={[styles.sectionTitle, { 
                        color: paperTheme.colors.text, 
                        fontSize: titleSize 
                    }]}>{i18n.font_size_title}</Text>
                    <Text style={[styles.sectionSubtitle, { 
                        color: paperTheme.colors.onSurfaceVariant,
                        fontSize: subtitleSize
                    }]}>{i18n.font_size_description}</Text>
                    <Divider style={styles.divider} />

                    <View style={styles.sliderWrapper}>
                        {/* SLIDER COMPONENTE */}
                        <Slider
                            style={styles.slider}
                            minimumValue={0} // CH
                            maximumValue={2} // G
                            step={1}         // Discreto (solo 0, 1, 2)
                            value={fontSizeScale} // Lee directamente el valor global
                            onValueChange={handleSliding} 
                            onSlidingComplete={handleSlidingComplete} 
                            minimumTrackTintColor={paperTheme.colors.primary}
                            maximumTrackTintColor={paperTheme.colors.outline}
                            thumbTintColor={paperTheme.colors.primary}
                        />

                        {/* Etiquetas debajo del Slider */}
                        <View style={styles.labelContainer}>
                            {sizeLabels.map((item) => (
                                <View 
                                    key={item.label} 
                                    style={styles.labelItem}
                                >
                                    <Text style={[styles.markerLabel, { 
                                        color: getLabelColor(item.value),
                                        fontSize: labelSize - 2 
                                    }]}>
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    
                    {/* TEXTO DE PREVISUALIZACIÓN */}
                    <View style={styles.previewContainer}>
                        <Text style={[{ 
                            // NOTA: Usamos FONT_SCALES[fontSizeScale] para ver el tamaño ABSOLUTO (14, 16, 18)
                            fontSize: FONT_SCALES[fontSizeScale], 
                            color: paperTheme.colors.text,
                            textAlign: 'center'
                        }]}>
                            Este es un texto de ejemplo para previsualizar el tamaño.
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1, 
    },
    scrollView: {
        flex: 1, 
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    scrollContentLandscape: {
        paddingHorizontal: 50, 
    },
    sectionContainer: {
        marginBottom: 30,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionSubtitle: {
        marginBottom: 15,
    },
    divider: {
        marginVertical: 10,
        backgroundColor: '#ccc',
        height: 1,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    radioButtonLabel: {
        // Fuente aplicada dinámicamente
    },
    
    // ESTILOS DEL SLIDER
    sliderWrapper: {
        marginTop: 10,
        paddingHorizontal: 10, 
    },
    slider: {
        height: 40,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        marginTop: -10,
        paddingHorizontal: 20, 
    },
    labelItem: {
        width: 'auto', 
        alignItems: 'center',
        minWidth: 30,
    },
    markerLabel: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Estilo para el contenedor de previsualización
    previewContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
    }
});

export default PreferenciasScreen;