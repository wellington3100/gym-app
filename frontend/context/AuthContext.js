// frontend/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Usa tu IP real confirmada: 192.168.1.69
const API_URL = 'http://192.168.1.69:5000/api';

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  const register = async (name, email, password) => {
    setIsLoading(true);
    console.log("Intentando registrar usuario:", name, email);
    console.log("URL completa:", `${API_URL}/auth/register`);
    
    try {
      // Intentar conectar al servidor para verificar conectividad
      console.log("Verificando conexión con el servidor...");
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 segundos para dar más tiempo
      });
      
      console.log("Respuesta completa:", response);
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data.success) {
        console.log("Registro exitoso");
        return response.data;
      } else {
        console.log("Error en respuesta:", response.data.message);
        throw new Error(response.data.message || 'Error de registro');
      }
    } catch (error) {
      console.error("Error detallado de registro:", error.message);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
      }
      
      if (error.message.includes('Network Error')) {
        throw new Error('Error de red. El servidor no está disponible. Verifica tu conexión WiFi y que el servidor esté en ejecución.');
      }
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error("Datos del error:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
        throw new Error(error.response.data.message || 'Error de registro');
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error("No se recibió respuesta del servidor");
        throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución y accesible en la red.');
      } else {
        // Error en la configuración de la petición
        console.error("Error en la petición:", error.message);
        throw new Error('Error en la solicitud: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      console.log("Intentando iniciar sesión:", email);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data.success) {
        setUserToken(response.data.token);
        setUserInfo(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error de inicio de sesión');
      }
    } catch (error) {
      console.error("Error en login:", error.message);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
      }
      
      if (error.message.includes('Network Error')) {
        throw new Error('Error de red. El servidor no está disponible. Verifica tu conexión WiFi y que el servidor esté en ejecución.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error de inicio de sesión');
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución y accesible en la red.');
      } else {
        throw new Error('Error en la solicitud: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUserInfo(null);
    setUserToken(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};