import { View, StyleSheet, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function MainForm({ navigation }) {
    return (
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
            <Text style={styles.text}>ShelfWay</Text>
            <Image source={require('../../Splash.png')} style={styles.image} resizeMode="contain" />
            <Text style={styles.text2}>Bienvenido a ShelfWay, donde perderte en las compras es cosa del pasado!</Text>
            <Button mode='contained' style={styles.button} labelStyle={{ fontSize: 18 }} onPress={() => navigation.navigate('LoginSC')}>Iniciar Sesión</Button>
            <Button mode='contained' style={styles.button} labelStyle={{ fontSize: 18 }} onPress={() => navigation.navigate('RegisterSC')}>Registrarse</Button>
            
            
            <Button mode='contained' style={styles.button} labelStyle={{ fontSize: 18 }} onPress={() => navigation.navigate('Main')}>Saltar loggin</Button>

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
        width: 230,
        height: 230,
    },
    text: {
        fontSize: 65,
        color: '#000000ff',
        alignContent: 'center'
    },
    text2: {
        fontSize: 18.5,
        color: '#000000ff',
        textAlign: 'center',
        marginBottom: 25,
    },
    button: {
        width: 300,
        height: 43,
        marginBottom: 30,
    },
    backButton: {
        position: 'absolute',
        top: 50,     // ajusta según tu diseño
        left: 20,
        zIndex: 10,
        backgroundColor: 'transparent',
    },

});
