import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Resources/firebaseConfig';
import { useTheme } from '../../Resources/ThemeProvider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

export default function ProductsScreen({ route }) {
    const { theme, isDarkTheme } = useTheme(); // ✅ correcto
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'es';
    const { query: searchQuery } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const colors = theme.colors;

    // ✅ ESTE HOOK DEBE ESTAR AQUÍ, FUERA DEL RETURN
    useFocusEffect(
        React.useCallback(() => {
            // Permitir todas las orientaciones en esta pantalla
            ScreenOrientation.unlockAsync();

            return () => {
                // Bloquear de nuevo cuando salgas
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            };
        }, [])
    );

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'productos'));
                const allProducts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nombre: data.nombre?.[currentLang]?.toLowerCase() || '',
                        descripcion: data.descripcion?.[currentLang]?.toLowerCase() || '',
                        tags: data.tags?.[currentLang]?.toLowerCase() || '',
                        price: data.precio || 0,
                        image: data.imagen || null,
                        anaquel: data.anaquel || '',
                        oferta: data.oferta || false,
                    };
                });

                const queryLower = searchQuery.toLowerCase();
                const filtered = allProducts.filter(
                    p =>
                        p.nombre.includes(queryLower) ||
                        p.descripcion.includes(queryLower) ||
                        p.tags.includes(queryLower)
                );

                setProducts(filtered);
            } catch (error) {
                console.error('Error fetching products: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, currentLang]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating size="large" color={colors.primary} />
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={{ color: colors.text, fontSize: 18 }}>
                    {t('productsScreen.noProducts')}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                style={isDarkTheme ? 'light' : 'dark'}
                backgroundColor={theme.colors.background}
                translucent={false}
            />
            <FlatList
                data={products}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item }) => (
                    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
                        <View style={styles.cardContent}>
                            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                            <View style={styles.info}>
                                <Text variant="titleLarge" style={{ color: colors.text, fontWeight: 'bold' }}>
                                    {item.nombre}
                                </Text>
                                <Text variant="bodyMedium" style={{ color: colors.text, marginVertical: 5 }}>
                                    {item.descripcion}
                                </Text>
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                                    ${item.price}
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },

    card: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
