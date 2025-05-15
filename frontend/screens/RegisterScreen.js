// frontend/screens/RegisterScreen.js
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
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useContext(AuthContext);

  const handleRegister = async () => {
    if (name.trim() === '' || email.trim() === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      console.log("Intentando registrar usuario...");
      const result = await register(name.trim(), email.trim(), password);
      console.log("Resultado del registro:", result);
      
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada correctamente. Inicia sesión para continuar.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error("Error durante el registro:", error);
      Alert.alert('Error', error.message || 'Error al registrarse');
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
          source={require('../assets/images/react-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para comenzar</Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Inicia Sesión</Text>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
  },
  loginText: {
    fontSize: 14,
    color: '#3366FF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RegisterScreen;