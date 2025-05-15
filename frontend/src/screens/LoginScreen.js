// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useContext(AuthContext);

  const handleLogin = async () => {
    if (email.trim() === '' || password === '') {
      Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/images/gym-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 40,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.black,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  registerText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen;