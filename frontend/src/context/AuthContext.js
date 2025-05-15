// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  const login = async (email, password) => {
    console.log("Login: intentando iniciar sesión con", email);
    setIsLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/login', {
        email,
        password,
      });
      
      console.log("Login: respuesta recibida", response.data.success);
      
      if (response.data.success) {
        const userData = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token
        };
        
        setUserInfo(userData);
        setUserToken(response.data.token);
        
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        await AsyncStorage.setItem('userToken', response.data.token);
        console.log("Login: datos guardados en AsyncStorage");
      } else {
        throw new Error(response.data.message || 'Error de inicio de sesión');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name, email, password) => {
    console.log("Register: intentando registrar a", email);
    setIsLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/register', {
        name,
        email,
        password,
      });
      
      console.log("Register: respuesta recibida", response.data.success);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error de registro');
      }
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    console.log("Logout: iniciando cierre de sesión");
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUserInfo(null);
      console.log("Logout: sesión cerrada correctamente");
    } catch (error) {
      console.error('Error de cierre de sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isLoggedIn = async () => {
    console.log("isLoggedIn: verificando si está logueado...");
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      let userInfo = await AsyncStorage.getItem('userInfo');
      
      console.log("isLoggedIn: Token obtenido:", userToken ? "Sí" : "No");
      
      if (userInfo) {
        console.log("isLoggedIn: Información de usuario encontrada");
        setUserInfo(JSON.parse(userInfo));
      }
      
      if (userToken) {
        console.log("isLoggedIn: Token encontrado, estableciendo estado");
        setUserToken(userToken);
      }
      
      setIsLoading(false);
      console.log("isLoggedIn: Verificación completada. isLoading=false");
    } catch (error) {
      console.error('Error al verificar el estado de inicio de sesión:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("AuthProvider: useEffect iniciado, llamando a isLoggedIn");
    isLoggedIn();
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        register,
        logout,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};