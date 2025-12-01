import * as React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Platform, Alert, Linking } from 'react-native';
import { useTheme, Switch, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import CustomAppbar from '../../components/CustomAppbar';
import { useTheme as useAppTheme } from '../../Resources/ThemeProvider'; 
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

function NotificacionesScreen() {
    const paperTheme = useTheme();
    const { t } = useTranslation();
    const { theme } = useAppTheme();

    const [isEventsEnabled, setIsEventsEnabled] = React.useState(false);
    const [notificationPermission, setNotificationPermission] = React.useState(false); 

    // --- LÓGICA DE PERMISOS ---
    const registerForPushNotificationsAsync = async () => {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#1976D2',
                });
            }

            if (!Device.isDevice) {
                return false;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            return finalStatus === 'granted';
        } catch (error) {
            console.log("Error configurando notificaciones:", error);
            return false;
        }
    };

    //  Verificamos permisos
    // Cargamos el estado visual del switch
    React.useEffect(() => {
        registerForPushNotificationsAsync().then(granted => {
            setNotificationPermission(granted);
        });

        const loadSwitchState = async () => {
            try {
                const savedState = await AsyncStorage.getItem('isEventsEnabled');
                if (savedState !== null) {
                    setIsEventsEnabled(savedState === 'true');
                }
            } catch (e) {
                console.log('Error cargando estado:', e);
            }
        };
        loadSwitchState();
    }, []);

    // --- LÓGICA DEL SWITCH ---
    const toggleEventsSwitch = async () => {

        if (isEventsEnabled) {
            setIsEventsEnabled(false);
            try {
                await AsyncStorage.setItem('isEventsEnabled', 'false'); 
            } catch (e) { console.log(e); }
            return;
        }

        if (!notificationPermission) {
            const granted = await registerForPushNotificationsAsync();
            
            if (granted) {
                setNotificationPermission(true);
                setIsEventsEnabled(true);
                try {
                    await AsyncStorage.setItem('isEventsEnabled', 'true'); 
                } catch (e) { console.log(e); }
            } else {
                Alert.alert(
                    "Permisos requeridos",
                    "Para recibir notificaciones, necesitas habilitar los permisos en la configuración de tu celular.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Ir a Ajustes", onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } else {
            setIsEventsEnabled(true);
            try {
                await AsyncStorage.setItem('isEventsEnabled', 'true'); 
            } catch (e) { console.log(e); }
        }
    };

    const baseSize = theme.baseFontSize || 16;
    const subtitleSize = baseSize - 2;
    const labelSize = baseSize;
    const warningSize = baseSize - 3; 

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: paperTheme.colors.background }]}>
            <StatusBar style="light" backgroundColor={paperTheme.colors.primary} />
            
            <CustomAppbar title={t('notificationsScreen.title')} />

            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
                <View style={styles.sectionContainer}>
                    
                    {!notificationPermission && (
                        <View style={[styles.warningBox, { backgroundColor: paperTheme.colors.notification }]}>
                            <Text style={[styles.warningText, { fontSize: warningSize }]}>
                                {t('notificationsScreen.warning')}
                            </Text>
                        </View>
                    )}

                    <Text style={[styles.descriptionText, { 
                        color: paperTheme.colors.onSurfaceVariant,
                        fontSize: subtitleSize
                    }]}>
                        {t('notificationsScreen.description')}
                    </Text>
                    
                    <Divider style={styles.divider} />

                    <View style={styles.switchContainer}>
                        <Text style={[styles.switchLabel, { 
                            color: paperTheme.colors.text,
                            fontSize: labelSize 
                        }]}>
                            {t('notificationsScreen.events')}
                        </Text>
                        <Switch
                            value={isEventsEnabled}
                            onValueChange={toggleEventsSwitch}
                            color={paperTheme.colors.primary}
                        />
                    </View>
                    
                    <Divider style={styles.divider} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
    sectionContainer: {
        marginBottom: 30,
    },
    descriptionText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    divider: {
        marginVertical: 10,
        backgroundColor: '#ccc',
        height: 1,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    switchLabel: {
        flex: 1, 
        marginRight: 10,
        lineHeight: 22,
    },
    warningBox: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    warningText: {
        color: 'white', 
        textAlign: 'center',
        fontWeight: 'bold',
    }
});

export default NotificacionesScreen;