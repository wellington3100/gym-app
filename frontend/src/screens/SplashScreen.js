// src/screens/SplashScreen.js
import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const SplashScreen = () => {
  const { isLoggedIn } = useContext(AuthContext);
  
  useEffect(() => {
    // Asegurarse de que la pantalla de splash no se quede para siempre
    console.log("SplashScreen: useEffect iniciado");
    const timer = setTimeout(() => {
      console.log("SplashScreen: ejecutando isLoggedIn después del temporizador");
      isLoggedIn();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/gym-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  text: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
});

export default SplashScreen;