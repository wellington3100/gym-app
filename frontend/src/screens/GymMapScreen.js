// src/screens/GymMapScreen.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

const GymMapScreen = ({ navigation }) => {
  // Datos de ejemplo para las máquinas
  const machines = {
    barras: [
      { id: 'b1', name: 'Barra Olímpica 1', status: 'available' },
      { id: 'b2', name: 'Barra Olímpica 2', status: 'in_use', exercise: 'Press de Banca', timeRemaining: 8 },
      { id: 'b3', name: 'Barra Olímpica 3', status: 'available' },
      { id: 'b4', name: 'Barra Olímpica 4', status: 'busy', waitingCount: 2 },
    ],
    poleas: [
      { id: 'p1', name: 'Polea Alta 1', status: 'available' },
      { id: 'p2', name: 'Polea Alta 2', status: 'in_use', exercise: 'Jalones', timeRemaining: 5 },
      { id: 'p3', name: 'Polea Baja 1', status: 'busy', waitingCount: 1 },
      { id: 'p4', name: 'Polea Baja 2', status: 'available' },
      { id: 'p5', name: 'Polea Cruzada 1', status: 'available' },
      { id: 'p6', name: 'Polea Cruzada 2', status: 'busy', waitingCount: 3 },
    ]
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#9c27b0'; // Morado
      case 'in_use': return '#ffc107';    // Amarillo
      case 'busy': return '#f44336';      // Rojo
      default: return '#9e9e9e';          // Gris
    }
  };

  // Función para obtener el texto según el estado
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'in_use': return 'En Uso';
      case 'busy': return 'Ocupada';
      default: return 'Desconocido';
    }
  };

  // Renderiza una máquina
  const renderMachine = (machine) => {
    const statusColor = getStatusColor(machine.status);
    
    return (
      <TouchableOpacity 
        key={machine.id}
        style={[styles.machineItem, { borderLeftColor: statusColor }]}
      >
        <Text style={styles.machineName}>{machine.name}</Text>
        <Text style={styles.machineStatus}>{getStatusText(machine.status)}</Text>
        
        {machine.status === 'in_use' && (
          <Text style={styles.machineInfo}>
            {machine.exercise} - {machine.timeRemaining} min restantes
          </Text>
        )}
        
        {machine.status === 'busy' && (
          <Text style={styles.machineInfo}>
            {machine.waitingCount} {machine.waitingCount === 1 ? 'persona' : 'personas'} en espera
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Mapa del Gimnasio</Text>
        <Text style={styles.subHeaderText}>
          Verifica la disponibilidad de máquinas en tiempo real
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Área de Barras</Text>
        <View style={styles.machinesContainer}>
          {machines.barras.map(machine => renderMachine(machine))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Área de Poleas</Text>
        <View style={styles.machinesContainer}>
          {machines.poleas.map(machine => renderMachine(machine))}
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Leyenda:</Text>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9c27b0' }]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ffc107' }]} />
          <Text style={styles.legendText}>En Uso</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Ocupada/Fila</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('QRScanner', { purpose: 'reserve' })}
      >
        <Text style={styles.scanButtonText}>Escanear QR para Reservar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sectionContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  machinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  machineItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  machineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  machineStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  machineInfo: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  legendContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#6200ee',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GymMapScreen;