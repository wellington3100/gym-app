// MachineDetailScreen.js
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const MachineDetailScreen = ({ route, navigation }) => {
  const { machine } = route.params;
  const [currentMachine, setCurrentMachine] = useState(machine);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    const newStatus = currentMachine.status === 'Libre' ? 'Ocupado' : 'Libre';
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/machines/${currentMachine._id}`, {
        status: newStatus
      });
      
      setCurrentMachine(response.data);
      Alert.alert(
        'Estado actualizado',
        `La máquina ahora está ${newStatus.toLowerCase()}`
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el estado de la máquina'
      );
    } finally {
      setLoading(false);
    }
  };

  const joinWaitlist = async () => {
    // Implementar la lógica para unirse a la lista de espera
    Alert.alert(
      'Lista de espera',
      'Te has unido a la lista de espera para esta máquina'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.machineHeader}>
        <Text style={styles.machineType}>{currentMachine.type}</Text>
        <Text style={styles.machineName}>{currentMachine.name}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{currentMachine.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado actual</Text>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: currentMachine.status === 'Libre' ? '#4CAF50' : '#F44336' }
            ]} 
          />
          <Text style={styles.statusText}>{currentMachine.status}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleStatus}
          >
            <Text style={styles.buttonText}>
              Marcar como {currentMachine.status === 'Libre' ? 'Ocupado' : 'Libre'}
            </Text>
          </TouchableOpacity>
        )}
        
        {currentMachine.status === 'Ocupado' && (
          <TouchableOpacity 
            style={styles.waitlistButton}
            onPress={joinWaitlist}
          >
            <Text style={styles.buttonText}>Unirse a lista de espera</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  machineHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  machineType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  machineName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    margin: 16,
    marginTop: 8,
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  waitlistButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MachineDetailScreen;