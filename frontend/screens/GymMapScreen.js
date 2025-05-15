// ARCHIVO: frontend/screens/GymMapScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  FlatList
} from 'react-native';

// Datos de ejemplo para las máquinas
const MACHINES_DATA = {
  barras: [
    { id: 'barra1', name: 'Barra Olímpica 1', status: 'available', queue: [] },
    { id: 'barra2', name: 'Barra Olímpica 2', status: 'in_use', queue: [], exercise: 'Press de Banca', timeRemaining: 8 },
    { id: 'barra3', name: 'Barra Olímpica 3', status: 'available', queue: [] },
    { id: 'barra4', name: 'Barra Olímpica 4', status: 'busy', queue: [
      { name: 'Juan Pérez', exercise: 'Sentadillas', time: 15 },
      { name: 'Ana García', exercise: 'Press Militar', time: 12 }
    ]},
  ],
  poleas: [
    { id: 'polea1', name: 'Polea Alta 1', status: 'available', queue: [] },
    { id: 'polea2', name: 'Polea Alta 2', status: 'in_use', queue: [], exercise: 'Jalones al Pecho', timeRemaining: 5 },
    { id: 'polea3', name: 'Polea Baja 1', status: 'in_use', queue: [
      { name: 'Carlos López', exercise: 'Remo Sentado', time: 10 }
    ], exercise: 'Extensiones de Tríceps', timeRemaining: 3 },
    { id: 'polea4', name: 'Polea Baja 2', status: 'available', queue: [] },
    { id: 'polea5', name: 'Polea Cruzada 1', status: 'available', queue: [] },
    { id: 'polea6', name: 'Polea Cruzada 2', status: 'busy', queue: [
      { name: 'María Rodríguez', exercise: 'Cruces de Pecho', time: 12 },
      { name: 'Roberto Sánchez', exercise: 'Cruces de Pecho', time: 12 },
      { name: 'Diana Torres', exercise: 'Jalones de Bíceps', time: 8 }
    ]},
    { id: 'polea7', name: 'Polea Multifuncional 1', status: 'in_use', queue: [], exercise: 'Extensiones de Tríceps', timeRemaining: 4 },
    { id: 'polea8', name: 'Polea Multifuncional 2', status: 'available', queue: [] },
  ]
};

// Datos de ejemplo para ejercicios
const EXERCISES = {
  barras: [
    { id: 'ex1', name: 'Press de Banca', time: 10, image: '🏋️‍♂️' },
    { id: 'ex2', name: 'Sentadillas', time: 15, image: '🏋️‍♂️' },
    { id: 'ex3', name: 'Peso Muerto', time: 15, image: '🏋️‍♂️' },
    { id: 'ex4', name: 'Press Militar', time: 12, image: '🏋️‍♂️' },
    { id: 'ex5', name: 'Remo Pendlay', time: 12, image: '🏋️‍♂️' },
    { id: 'ex6', name: 'Otro (15 min)', time: 15, image: '🏋️‍♂️' },
  ],
  poleas: [
    { id: 'ex7', name: 'Jalones al Pecho', time: 10, image: '🏋️‍♂️' },
    { id: 'ex8', name: 'Remo Sentado', time: 10, image: '🏋️‍♂️' },
    { id: 'ex9', name: 'Extensiones de Tríceps', time: 8, image: '🏋️‍♂️' },
    { id: 'ex10', name: 'Curl de Bíceps', time: 8, image: '🏋️‍♂️' },
    { id: 'ex11', name: 'Cruces de Pecho', time: 12, image: '🏋️‍♂️' },
    { id: 'ex12', name: 'Otro (15 min)', time: 15, image: '🏋️‍♂️' },
  ]
};

// Datos de ejemplo para agarraderas de poleas
const HANDLES = [
  { id: 'h1', name: 'Barra Recta', available: true },
  { id: 'h2', name: 'Barra V', available: false },
  { id: 'h3', name: 'Barra Curva', available: true },
  { id: 'h4', name: 'Cuerda', available: true },
  { id: 'h5', name: 'Agarre Individual', available: false },
  { id: 'h6', name: 'Agarre Ancho', available: true },
];

const GymMapScreen = ({ navigation }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [multipleExercises, setMultipleExercises] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);

  const getMachineStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#9c27b0'; // Morado
      case 'in_use':
        return '#ffc107'; // Amarillo
      case 'busy':
        return '#f44336'; // Rojo
      default:
        return '#9e9e9e'; // Gris
    }
  };

  const getMachineStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'in_use':
        return 'En Uso';
      case 'busy':
        return 'Ocupada';
      default:
        return 'Estado desconocido';
    }
  };

  const handleMachinePress = (machine, type) => {
    setSelectedMachine({ ...machine, type });
    setModalVisible(true);
  };

  const handleReserveMachine = () => {
    // Aquí iría la lógica para reservar la máquina
    // Por ahora solo cerramos el modal
    setModalVisible(false);
    
    // Simulamos escaneo de QR mostrando el modal de reserva
    setReserveModalVisible(true);
  };

  const handleViewQueue = () => {
    setModalVisible(false);
    setQueueModalVisible(true);
  };

  const renderMachineItem = (machine, type) => {
    const statusColor = getMachineStatusColor(machine.status);
    
    return (
      <TouchableOpacity
        key={machine.id}
        style={[styles.machineItem, { borderColor: statusColor }]}
        onPress={() => handleMachinePress(machine, type)}
      >
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        <Text style={styles.machineName}>{machine.name}</Text>
        <Text style={styles.machineStatus}>{getMachineStatusText(machine.status)}</Text>
        
        {machine.status === 'in_use' && (
          <Text style={styles.machineInfo}>
            {machine.exercise} - {machine.timeRemaining} min restantes
          </Text>
        )}
        
        {machine.status === 'busy' && (
          <Text style={styles.machineInfo}>
            {machine.queue.length} {machine.queue.length === 1 ? 'persona' : 'personas'} en espera
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    // Si es una polea, mostrar modal de agarraderas
    if (selectedMachine.type === 'poleas') {
      setHandleModalVisible(true);
    } else {
      // Simulamos confirmación de reserva
      setReserveModalVisible(false);
      alert(`¡Has reservado ${selectedMachine.name} para ${exercise.name}!`);
    }
  };

  const handleHandleSelect = (handle) => {
    if (!handle.available) {
      alert('Esta agarradera no está disponible actualmente.');
      return;
    }
    
    setHandleModalVisible(false);
    // Simulamos confirmación de reserva
    setReserveModalVisible(false);
    alert(`¡Has reservado ${selectedMachine.name} para ${selectedExercise.name} con ${handle.name}!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mapa del Gimnasio</Text>
        <Text style={styles.sectionSubtitle}>
          Ver disponibilidad de máquinas en tiempo real
        </Text>
      </View>

      {/* Sección de Barras */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Área de Barras</Text>
        
        <View style={styles.barrasContainer}>
          {MACHINES_DATA.barras.map(machine => renderMachineItem(machine, 'barras'))}
        </View>
      </View>

      {/* Sección de Poleas */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Área de Poleas</Text>
        
        <View style={styles.poleasContainer}>
          {MACHINES_DATA.poleas.map(machine => renderMachineItem(machine, 'poleas'))}
        </View>
      </View>

      {/* Leyenda de colores */}
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

      {/* Modal de Información de Máquina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMachine?.name}</Text>
            
            <View style={styles.modalStatusContainer}>
              <View 
                style={[
                  styles.modalStatusIndicator, 
                  { backgroundColor: selectedMachine ? getMachineStatusColor(selectedMachine.status) : '#9e9e9e' }
                ]} 
              />
              <Text style={styles.modalStatusText}>
                {selectedMachine ? getMachineStatusText(selectedMachine.status) : ''}
              </Text>
            </View>

            {selectedMachine?.status === 'in_use' && (
              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalInfoLabel}>Ejercicio actual:</Text>
                <Text style={styles.modalInfoValue}>{selectedMachine.exercise}</Text>
                
                <Text style={styles.modalInfoLabel}>Tiempo restante:</Text>
                <Text style={styles.modalInfoValue}>{selectedMachine.timeRemaining} minutos</Text>
              </View>
            )}

            {selectedMachine?.status === 'busy' && (
              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalInfoLabel}>Personas en espera:</Text>
                <Text style={styles.modalInfoValue}>{selectedMachine.queue.length}</Text>
                
                <Text style={styles.modalInfoLabel}>Tiempo de espera estimado:</Text>
                <Text style={styles.modalInfoValue}>
                  {selectedMachine.queue.reduce((total, person) => total + person.time, 0)} minutos
                </Text>
              </View>
            )}

            <View style={styles.modalButtonsContainer}>
              {selectedMachine?.status === 'available' && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleReserveMachine}
                >
                  <Text style={styles.primaryButtonText}>Reservar Ahora</Text>
                </TouchableOpacity>
              )}

              {(selectedMachine?.status === 'in_use' || selectedMachine?.status === 'busy') && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.primaryButton]}
                    onPress={handleReserveMachine}
                  >
                    <Text style={styles.primaryButtonText}>Unirse a la Fila</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.secondaryButton]}
                    onPress={handleViewQueue}
                  >
                    <Text style={styles.secondaryButtonText}>Ver Fila</Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Fila */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={queueModalVisible}
        onRequestClose={() => setQueueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Fila de Espera</Text>
            <Text style={styles.modalSubtitle}>{selectedMachine?.name}</Text>

            {selectedMachine?.status === 'in_use' && (
              <View style={styles.queueItemCurrent}>
                <Text style={styles.queueItemCurrentTitle}>En uso actualmente:</Text>
                <Text style={styles.queueItemText}>Ejercicio: {selectedMachine.exercise}</Text>
                <Text style={styles.queueItemText}>Tiempo restante: {selectedMachine.timeRemaining} minutos</Text>
              </View>
            )}

            {selectedMachine?.queue?.length > 0 ? (
              <FlatList
                data={selectedMachine.queue}
                keyExtractor={(item, index) => `queue-${index}`}
                renderItem={({ item, index }) => (
                  <View style={styles.queueItem}>
                    <Text style={styles.queueItemPosition}>#{index + 1}</Text>
                    <Text style={styles.queueItemName}>{item.name}</Text>
                    <Text style={styles.queueItemExercise}>{item.exercise}</Text>
                    <Text style={styles.queueItemTime}>{item.time} min</Text>
                  </View>
                )}
                style={styles.queueList}
              />
            ) : (
              <Text style={styles.emptyQueueText}>
                No hay nadie en la fila de espera.
              </Text>
            )}

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => {
                  setQueueModalVisible(false);
                  setReserveModalVisible(true);
                }}
              >
                <Text style={styles.primaryButtonText}>Unirse a la Fila</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setQueueModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Reserva */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reserveModalVisible}
        onRequestClose={() => setReserveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reservar Máquina</Text>
            <Text style={styles.modalSubtitle}>{selectedMachine?.name}</Text>
            
            <Text style={styles.reserveInstructions}>
              Selecciona el ejercicio que realizarás:
            </Text>

            <ScrollView style={styles.exercisesList}>
              {selectedMachine && EXERCISES[selectedMachine.type].map(exercise => (
                <TouchableOpacity 
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => handleExerciseSelect(exercise)}
                >
                  <Text style={styles.exerciseIcon}>{exercise.image}</Text>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseTime}>Tiempo aproximado: {exercise.time} min</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.multipleExercisesContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setMultipleExercises(!multipleExercises)}
              >
                <View style={[styles.checkbox, multipleExercises && styles.checkboxChecked]}>
                  {multipleExercises && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Reservar para múltiples ejercicios</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setReserveModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Agarraderas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={handleModalVisible}
        onRequestClose={() => setHandleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccionar Agarradera</Text>
            <Text style={styles.modalSubtitle}>Para {selectedExercise?.name}</Text>
            
            <Text style={styles.reserveInstructions}>
              Elige la agarradera que usarás:
            </Text>

            <ScrollView style={styles.handlesList}>
              {HANDLES.map(handle => (
                <TouchableOpacity 
                  key={handle.id}
                  style={[
                    styles.handleItem, 
                    !handle.available && styles.handleItemUnavailable
                  ]}
                  onPress={() => handleHandleSelect(handle)}
                  disabled={!handle.available}
                >
                  <Text style={[
                    styles.handleName,
                    !handle.available && styles.handleNameUnavailable
                  ]}>
                    {handle.name}
                  </Text>
                  
                  <Text style={[
                    styles.handleStatus,
                    !handle.available && styles.handleStatusUnavailable
                  ]}>
                    {handle.available ? 'Disponible' : 'No disponible'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setHandleModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  barrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  poleasContainer: {
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
    statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 5,
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
    marginBottom: 30,
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
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  modalStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  modalStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalInfoContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalButtonsContainer: {
    marginTop: 10,
  },
  modalButton: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#e8eaf6',
  },
  secondaryButtonText: {
    color: '#6200ee',
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
  queueItemCurrent: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  queueItemCurrentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 8,
  },
  queueItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  queueList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  queueItemPosition: {
    width: 25,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  queueItemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  queueItemExercise: {
    width: 120,
    fontSize: 12,
    color: '#666',
  },
  queueItemTime: {
    width: 50,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyQueueText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  reserveInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  exercisesList: {
    maxHeight: 250,
    marginBottom: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
  },
  exerciseIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseTime: {
    fontSize: 12,
    color: '#666',
  },
  multipleExercisesContainer: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6200ee',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6200ee',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  handlesList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  handleItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
  },
  handleItemUnavailable: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  handleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  handleNameUnavailable: {
    color: '#999',
  },
  handleStatus: {
    fontSize: 12,
    color: '#4caf50',
  },
  handleStatusUnavailable: {
    color: '#f44336',
  },
});

export default GymMapScreen;            