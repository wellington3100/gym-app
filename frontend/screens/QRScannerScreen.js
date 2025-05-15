// ARCHIVO: frontend/screens/QRScannerScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AuthContext } from '../context/AuthContext';

const QRScannerScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  
  // Obtener el propósito del escaneo de los parámetros de la ruta
  const scanPurpose = route.params?.purpose || 'reserve';
  const machineData = route.params?.machineData;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    
    try {
      // Intentar parsear los datos del QR
      const qrData = JSON.parse(data);
      
      // Verificar si los datos del QR son válidos para el propósito actual
      if (qrData.type === 'gym_machine') {
        // Simular procesamiento
        setTimeout(() => {
          setLoading(false);
          
          if (scanPurpose === 'reserve') {
            // Si estamos reservando una máquina nueva
            navigation.replace('MachineDetails', { 
              machineId: qrData.machineId,
              action: 'reserve',
              fromScanner: true
            });
          } else if (scanPurpose === 'confirm') {
            // Si estamos confirmando una reserva existente
            processMachineConfirmation(qrData.machineId);
          } else if (scanPurpose === 'complete') {
            // Si estamos marcando como completado un ejercicio
            processMachineCompletion(qrData.machineId);
          } else if (scanPurpose === 'record') {
            // Si estamos registrando un logro (peso y repeticiones)
            processRecordAchievement(qrData.machineId);
          }
        }, 1500);
      } else {
        // QR inválido para el gimnasio
        setLoading(false);
        Alert.alert(
          "Código QR no válido",
          "Este código QR no corresponde a una máquina del gimnasio.",
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      // Error al parsear el QR
      setLoading(false);
      Alert.alert(
        "Código QR no reconocido",
        "No se pudo leer la información del código QR. Inténtalo de nuevo.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
  };

  const processMachineConfirmation = (machineId) => {
    // Aquí iría la lógica para confirmar una reserva
    // Por ahora, solo mostramos una alerta
    Alert.alert(
      "Confirmación exitosa",
      "Has confirmado tu presencia en la máquina. ¡Buen entrenamiento!",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const processMachineCompletion = (machineId) => {
    // Aquí iría la lógica para marcar como completado un ejercicio
    Alert.alert(
      "Ejercicio completado",
      "Has marcado tu ejercicio como completado. ¡Buen trabajo!",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const processRecordAchievement = (machineId) => {
    // Navegar a la pantalla de registro de logro
    navigation.replace('RecordAchievement', { 
      machineId: machineId,
      machineData: machineData
    });
  };

  const getScannerInstructions = () => {
    switch (scanPurpose) {
      case 'reserve':
        return "Escanea el código QR de la máquina que deseas reservar";
      case 'confirm':
        return "Escanea el código QR para confirmar tu presencia en la máquina";
      case 'complete':
        return "Escanea el código QR para marcar como completado tu ejercicio";
      case 'record':
        return "Escanea el código QR de la pesa para registrar tu logro";
      default:
        return "Escanea el código QR de la máquina";
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          No se ha concedido acceso a la cámara. Para usar esta función, debes permitir el acceso a la cámara en la configuración de la aplicación.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Procesando código QR...</Text>
        </View>
      ) : (
        <>
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.scanner}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerTarget} />
            </View>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{getScannerInstructions()}</Text>
            
            {scanned && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => setScanned(false)}
              >
                <Text style={styles.buttonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#6200ee',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    margin: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
  },
});

export default QRScannerScreen;