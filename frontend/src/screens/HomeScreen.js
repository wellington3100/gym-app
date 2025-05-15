// HomeScreen_new.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, 
  TouchableOpacity, RefreshControl, SafeAreaView
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const HomeScreen = ({ navigation, route }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const username = route.params?.username || 'Usuario';

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/machines`);
      setMachines(response.data);
    } catch (err) {
      console.error('Error al obtener máquinas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const onMachinePress = (machine) => {
    navigation.navigate('MachineDetail', { machine });
  };

  const renderMachineItem = ({ item }) => {
    const statusColor = item.status === 'Libre' ? '#4CAF50' : '#F44336';
    
    return (
      <TouchableOpacity 
        style={styles.machineCard}
        onPress={() => onMachinePress(item)}
      >
        <View style={styles.machineInfo}>
          <Text style={styles.machineName}>{item.name}</Text>
          <Text style={styles.machineDescription}>{item.description}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.machineIconContainer}>
          <Text style={{color: '#2196F3', fontWeight: 'bold'}}>
            {item.type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.usernameText}>{username}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Máquinas</Text>
      
      <FlatList
        data={machines}
        renderItem={renderMachineItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.machinesList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMachines}
            colors={['#2196F3']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay máquinas disponibles</Text>
            <Text style={styles.emptySuggestion}>
              Desliza hacia abajo para intentar cargar de nuevo
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
  },
  usernameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
  },
  machinesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  machineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  machineInfo: {
    flex: 3,
  },
  machineName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  machineDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  machineIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySuggestion: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;