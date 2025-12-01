import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Resources/firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NotificationController = () => {

    useEffect(() => {
        const now = new Date(); 
        let unsubscribe = null;

        const startListening = async () => {
            const q = query(
                collection(db, "eventos"),
                where("createdAt", ">", now)
            );

            unsubscribe = onSnapshot(q, async (snapshot) => {
                // Antes de procesar, verificamos si el usuario quiere recibir notificaciones
                const isEnabled = await AsyncStorage.getItem('isEventsEnabled');

                if (isEnabled === 'true') {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const eventData = change.doc.data();
                            const eventTitle = eventData.titulo?.es || "¡Nuevo Evento!";
                            schedulePushNotification(eventTitle);
                        }
                    });
                }
            }, (error) => {
                console.log("Error en listener global de eventos:", error);
            });
        };

        startListening();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    async function schedulePushNotification(tituloEvento) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "¡Evento nuevo en la tienda, no te lo pierdas! 🎉",
                    body: `Entérate del próximo evento: ${tituloEvento}`,
                    color: '#1976D2', 
                    sound: true,
                },
                trigger: null,
            });
        } catch (error) {
            console.log("Error enviando notificación:", error);
        }
    }


    return null;
};

export default NotificationController;