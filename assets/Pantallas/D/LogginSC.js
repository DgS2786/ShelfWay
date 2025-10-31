import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, Alert } from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Resources/firebaseConfig'; // Asegúrate que esta ruta sea correcta

function LogginSC() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa tu correo y contraseña");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            Keyboard.dismiss();

            setTimeout(() => {
                Alert.alert(
                    "Bienvenido",
                    `Inicio de sesión exitoso, Bienvenido`,
                    [
                        {
                            text: "Continuar",
                            onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'Main' }],
                            }) // o la pantalla principal
                        }
                    ],
                    { cancelable: false }
                );
            }, 50);
        } catch (error) {
            let mensaje = "";
            switch (error.code) {
                case 'auth/invalid-email':
                    mensaje = "Correo electrónico inválido";
                    break;
                case 'auth/user-not-found':
                    mensaje = "Ocurrió un error con el correo electrónico o la contraseña";
                    break;
                case 'auth/wrong-password':
                    mensaje = "Ocurrió un error con el correo electrónico o la contraseña";
                    break;
                default:
                    mensaje = "Ocurrió un error al iniciar sesión";
            }
            Alert.alert("Error", mensaje);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: '#fff' }]}>
                <IconButton icon="arrow-left" size={28} onPress={() => navigation.goBack()} style={styles.backButton} />
                <Text style={styles.text}>¡Hola de nuevo!</Text>

                <Text style={styles.text2}>Correo Electrónico</Text>
                <TextInput
                    mode='outlined'
                    label="Correo Electrónico"
                    style={styles.input}
                    outlineColor="#26A69A"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.text2}>Contraseña</Text>
                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    style={styles.input}
                    outlineColor="#26A69A"
                    secureTextEntry={!visible}
                    value={password}
                    onChangeText={setPassword}
                    right={
                        <TextInput.Icon
                            icon={visible ? "eye-off" : "eye"}
                            onPress={() => setVisible(!visible)}
                        />
                    }
                />

                <Button
                    mode='contained'
                    style={styles.button}
                    labelStyle={{ fontSize: 18 }}
                    onPress={handleLogin}
                >
                    Iniciar Sesión
                </Button>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default LogginSC;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
    },
    text: {
        fontSize: 50,
        color: '#000000ff',
        alignContent: 'center',
        marginTop: 180,
    },
    text2: {
        fontSize: 20,
        color: '#000000ff',
        textAlign: 'left',
        marginBottom: 10,
        marginTop: 25,
        alignSelf: 'flex-start',
        marginLeft: 45,
    },
    button: {
        width: 300,
        height: 43,
        marginBottom: 30,
        marginTop: 30,
    },
    input: {
        backgroundColor: '#fff',
        activeOutlineColor: '#1976D2',
        width: 300,
        height: 60,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
});
