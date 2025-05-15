// ARCHIVO: frontend/screens/RecordAchievementScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

// Datos de ejemplo para la tabla de líderes
const LEADERBOARD_DATA = [
  { userId: 'user1', name: 'Carlos Mendoza', reps: 12, weight: 100, points: 1200 },
  { userId: 'user2', name: 'Laura Sánchez', reps: 10, weight: 110, points: 1100 },
  { userId: 'user3', name: 'Miguel Ángel', reps: 8, weight: 120, points: 960 },
  { userId: 'user4', name: 'Ana García', reps: 15, weight: 70, points: 1050 },
  { userId: 'user5', name: 'Roberto Díaz', reps: 6, weight: 150, points: 900 },
];

const RecordAchievementScreen = ({ navigation, route }) => {
  const { userInfo } = useContext(AuthContext);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  
  const machineId = route.params?.machineId;
  const machineData = route.params?.machineData || { name: 'Máquina' };

  useEffect(() => {
    // Simular carga de datos de la tabla de líderes
    setLoading(true);
    setTimeout(() => {
      setLeaderboardData(LEADERBOARD_DATA);
      setLoading(false);
      
      // Determinar el rango del usuario actual (si existe)
      const userPosition = LEADERBOARD_DATA.findIndex(leader => leader.userId === userInfo.id);
      if (userPosition !== -1) {
        setUserRank(userPosition + 1);
      }
    }, 1000);
  }, []);

  const calculatePoints = (weight, reps) => {
    // Fórmula simple: peso x repeticiones
    return weight * reps;
  };

  const handleSubmit = () => {
    // Validar entradas
    const weightValue = parseFloat(weight);
    const repsValue = parseInt(reps);
    
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Error', 'Por favor ingresa un peso válido');
      return;
    }
    
    if (isNaN(repsValue) || repsValue <= 0) {
      Alert.alert('Error', 'Por favor ingresa un número válido de repeticiones');
      return;
    }
    
    setSubmitting(true);
    
    // Calcular puntos
    const points = calculatePoints(weightValue, repsValue);
    
    // Simular envío a servidor
    setTimeout(() => {
      setSubmitting(false);
      
      // Mostrar mensaje de éxito con los puntos ganados
      Alert.alert(
        '¡Logro Registrado!',
        `Has registrado ${repsValue} repeticiones con ${weightValue} kg.\n\nHas ganado ${points} FitnessPuntos.`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Registrar Logro</Text>
          <Text style={styles.subtitle}>{machineData.name}</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Ingresa el peso en kg"
            keyboardType="decimal-pad"
          />
          
          <Text style={styles.label}>Repeticiones</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            placeholder="Ingresa el número de repeticiones"
            keyboardType="number-pad"
          />
          
          {weight && reps && !isNaN(parseFloat(weight)) && !isNaN(parseInt(reps)) && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>FitnessPuntos a ganar:</Text>
              <Text style={styles.previewValue}>
                {calculatePoints(parseFloat(weight), parseInt(reps))}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Logro</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>Tabla de Líderes</Text>
          <Text style={styles.leaderboardSubtitle}>Los mejores en {machineData.name}</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
          ) : (
            <>
              <View style={styles.leaderboardHeader}>
                <Text style={[styles.leaderboardHeaderText, styles.rankColumn]}>#</Text>
                <Text style={[styles.leaderboardHeaderText, styles.nameColumn]}>Usuario</Text>
                <Text style={[styles.leaderboardHeaderText, styles.statsColumn]}>Rep x Peso</Text>
                <Text style={[styles.leaderboardHeaderText, styles.pointsColumn]}>Puntos</Text>
              </View>
              
              {leaderboardData.map((leader, index) => (
                <View 
                  key={leader.userId}
                  style={[
                    styles.leaderboardRow,
                    leader.userId === userInfo.id && styles.highlightedRow,
                    index === 0 && styles.firstPlaceRow
                  ]}
                >
                  <Text style={[styles.leaderboardText, styles.rankColumn]}>
                    {index + 1}
                    {index === 0 && ' 🏆'}
                  </Text>
                  <Text 
                    style={[
                      styles.leaderboardText, 
                      styles.nameColumn,
                      leader.userId === userInfo.id && styles.highlightedText
                    ]}
                    numberOfLines={1}
                  >
                    {leader.name}
                  </Text>
                  <Text style={[styles.leaderboardText, styles.statsColumn]}>
                    {leader.reps} x {leader.weight}kg
                  </Text>
                  <Text style={[styles.leaderboardText, styles.pointsColumn]}>
                    {leader.points}
                  </Text>
                </View>
              ))}
              
              {userRank === null && (
                <View style={styles.noRankContainer}>
                  <Text style={styles.noRankText}>
                    ¡Aún no apareces en la tabla! Registra tu primer logro.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            1. Registra el peso y las repeticiones que has realizado.
          </Text>
          <Text style={styles.infoText}>
            2. Los FitnessPuntos se calculan multiplicando el peso por las repeticiones.
          </Text>
          <Text style={styles.infoText}>
            3. ¡Compite por el primer lugar en la tabla de líderes!
          </Text>
          <Text style={styles.infoText}>
            4. Los puntos acumulados pueden canjearse por recompensas en la tienda.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  previewContainer: {
    backgroundColor: '#f0f7ff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    color: '#0066cc',
  },
  previewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboardContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 30,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  leaderboardHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  leaderboardRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leaderboardText: {
    fontSize: 14,
    color: '#333',
  },
  rankColumn: {
    width: '10%',
  },
  nameColumn: {
    width: '35%',
  },
  statsColumn: {
    width: '30%',
  },
  pointsColumn: {
    width: '25%',
    textAlign: 'right',
  },
  highlightedRow: {
    backgroundColor: '#f0f0ff',
  },
  highlightedText: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  firstPlaceRow: {
    backgroundColor: '#fff9e0',
  },
  noRankContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 15,
  },
  noRankText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default RecordAchievementScreen;