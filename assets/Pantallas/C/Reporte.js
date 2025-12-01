import { db } from '../../Resources/firebaseConfig';
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { TextInput, Button, useTheme, Dialog, Portal } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import CustomAppbar from '../../components/CustomAppbar';
import { useTheme as useAppTheme } from '../../Resources/ThemeProvider';

function ReporteScreen() {
    const paperTheme = useTheme();
    const { t } = useTranslation();
    const { theme } = useAppTheme();

    const [nombre, setNombre] = React.useState('');
    const [apellidos, setApellidos] = React.useState('');
    const [correo, setCorreo] = React.useState('');
    const [problema, setProblema] = React.useState('');

    // Estado para controlar si se está enviando (loading)
    const [loading, setLoading] = React.useState(false);

    const [dialogVisible, setDialogVisible] = React.useState(false);
    const navigation = useNavigation();

    const hideDialog = () => setDialogVisible(false);

    const baseSize = theme.baseFontSize || 16;
    const subtitleSize = baseSize - 2;
    const regularSize = baseSize;
    const dialogTitleSize = baseSize + 4;

    const { width, height } = Dimensions.get('window');
    const isPortrait = height >= width;


    const handleSubmit = async () => {
        const requiredFields = [nombre, apellidos, correo, problema];

        if (requiredFields.some(field => !field.trim())) {
            alert(t('reportScreen.error_complete_fields'));
            return;
        }

        setLoading(true); 

        try {
            // Guardar en Firestore en la colección "reportes"
            await addDoc(collection(db, "reportes"), {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                correo: correo.trim(),
                problema: problema.trim(),
                fechaCreacion: serverTimestamp(), 
                status: 'nuevo' 
            });

            console.log('Reporte enviado correctamente a Firebase');

            // Limpiar formulario
            setNombre('');
            setApellidos('');
            setCorreo('');
            setProblema('');

            // Mostrar diálogo de éxito
            setDialogVisible(true);

        } catch (error) {
            console.error("Error al guardar reporte: ", error);
            Alert.alert("Error", "No se pudo enviar el reporte. Por favor verifica tu conexión.");
        } finally {
            setLoading(false); 
        }
    };

    const CONTACT_EMAIL = 'shelfwayad@gmail.com';

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar style="light" backgroundColor={theme.colors.primary} />

            <CustomAppbar title={t('reportScreen.header_title')} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.headerTextContainer}>
                    <Text style={[styles.helpText, {
                        color: theme.colors.text,
                        fontSize: subtitleSize,
                        fontWeight: 'bold'
                    }]}>

                        {t('reportScreen.help_title')}
                    </Text>
                    <Text style={[styles.instructionText, {
                        color: theme.colors.onSurfaceVariant,
                        fontSize: regularSize
                    }]}>

                        {t('reportScreen.description')}
                    </Text>
                </View>

                <View style={styles.formContainer}>

                    <TextInput
                        label={t('reportScreen.name_label')}
                        value={nombre}
                        onChangeText={setNombre}
                        mode="outlined"
                        placeholder={t('reportScreen.name_placeholder')}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor={theme.colors.primary}
                        keyboardType="default"
                        theme={{ colors: { text: theme.colors.text, placeholder: theme.colors.placeholder }, fonts: { regular: { fontSize: regularSize } } }}
                    />

                    <TextInput
                        label={t('reportScreen.lastname_label')}
                        value={apellidos}
                        onChangeText={setApellidos}
                        mode="outlined"
                        placeholder={t('reportScreen.lastname_placeholder')}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor={theme.colors.primary}
                        keyboardType="default"
                        theme={{ colors: { text: theme.colors.text, placeholder: theme.colors.placeholder }, fonts: { regular: { fontSize: regularSize } } }}
                    />


                    <TextInput
                        label={t('reportScreen.email_label')}
                        value={correo}
                        onChangeText={setCorreo}
                        mode="outlined"
                        placeholder={t('reportScreen.email_placeholder')}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor={theme.colors.primary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        theme={{ colors: { text: theme.colors.text, placeholder: theme.colors.placeholder }, fonts: { regular: { fontSize: regularSize } } }}
                    />


                    <TextInput
                        label={t('reportScreen.problem_label')}
                        value={problema}
                        onChangeText={setProblema}
                        mode="outlined"
                        multiline={true}
                        numberOfLines={isPortrait ? 5 : 3}
                        style={[styles.input, isPortrait ? styles.textAreaPortrait : styles.textAreaLandscape]}
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor={theme.colors.primary}
                        textAlignVertical="top"
                        theme={{ colors: { text: theme.colors.text, placeholder: theme.colors.placeholder }, fonts: { regular: { fontSize: regularSize } } }}
                    />


                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading} 
                        style={styles.button}
                        icon="check"
                        labelStyle={{ fontSize: regularSize }}
                    >
                        {loading ? "Enviando..." : t('reportScreen.button_send')}
                    </Button>
                </View>
            </ScrollView>


            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog} style={{ backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={{ textAlign: 'center', fontSize: dialogTitleSize, color: theme.colors.onSurface }}>
                        {t('reportScreen.dialog_title')}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, fontSize: regularSize, lineHeight: regularSize * 1.5 }}>
                            {t('reportScreen.dialog_part1')}
                            <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>{CONTACT_EMAIL}</Text>
                            {t('reportScreen.dialog_part2')}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} mode="text" labelStyle={{ color: theme.colors.primary }}>
                            {t('reportScreen.button_ok')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    headerTextContainer: {
        marginBottom: 20,
    },
    helpText: {
        marginBottom: 5,
    },
    instructionText: {
        lineHeight: 22,
    },
    formContainer: {

    },
    input: {
        marginBottom: 20,
    },
    inputOutline: {
        borderRadius: 4,
    },
    textAreaPortrait: {
        minHeight: 150,
    },
    textAreaLandscape: {
        minHeight: 100,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
});

export default ReporteScreen;