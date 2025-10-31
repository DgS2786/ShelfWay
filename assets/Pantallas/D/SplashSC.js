import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

export default function Initial({ navigation }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('MainForm');
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: '#1976D2' }]}>
            <Text style={styles.text}>ShelfWay</Text>
            <Image source={require('../../SplashW.png')} style={styles.image} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 250,
        height: 250,
    },
    text: {
        fontSize: 80,
        color: '#fff',
        marginBottom: 20,
    },
});
