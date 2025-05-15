// ARCHIVO: frontend/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Pantallas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import GymMapScreen from '../screens/GymMapScreen';
import QRScannerScreen from '../screens/QRScannerScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Enfoque alternativo: definir la ruta inicial según el estado de autenticación
  const initialRouteName = userToken ? "Home" : "Login";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {/* Rutas de autenticación */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      
      {/* Rutas de la aplicación */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'GymApp',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="GymMap" 
        component={GymMapScreen}
        options={{ 
          title: 'Mapa del Gimnasio',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{ 
          title: 'Escanear Código QR',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;