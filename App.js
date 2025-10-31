import * as React from 'react';
import { ThemeContextProvider } from './assets/Resources/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './assets/Pantallas/D/SplashSC';
import MainScreen from './assets/Pantallas/D/MainSC';
import MainForm from './assets/Pantallas/D/MainformSC';
import LoginScreen from './assets/Pantallas/D/LogginSC';
import RegisterScreen from './assets/Pantallas/D/RegisterSC';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicial" component={SplashScreen} />
          <Stack.Screen name="MainForm" component={MainForm} />
          <Stack.Screen name="LoginSC" component={LoginScreen} />
          <Stack.Screen name="RegisterSC" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContextProvider>
  );
}
