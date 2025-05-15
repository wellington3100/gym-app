// frontend/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthContext';

// Pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

// Componente principal de la App
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false // Deshabilita el gesto de retroceso
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;