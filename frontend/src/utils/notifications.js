// src/utils/notifications.js
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Registrar el dispositivo para recibir notificaciones push
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('No se obtuvieron permisos para las notificaciones push!');
      return;
    }
    
    // Obtener token expo push
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    console.log('Las notificaciones push solo funcionan en dispositivos físicos');
  }

  // En Android, necesitamos configurar el canal
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Función para programar una notificación local
export async function scheduleLocalNotification(title, body, trigger = null) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: trigger || undefined,
  });
}

// Función para enviar notificación al acercarse el tiempo de reserva
export async function scheduleReservationReminder(reservation) {
  const reservationDate = new Date(reservation.startTime);
  const reminderDate = new Date(reservationDate);
  reminderDate.setMinutes(reminderDate.getMinutes() - 15); // 15 minutos antes
  
  const now = new Date();
  
  // Solo programar si la fecha de recordatorio es futura
  if (reminderDate > now) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio de reserva',
        body: `Tu reserva para ${reservation.machine.name} comienza en 15 minutos`,
        data: { reservationId: reservation._id },
      },
      trigger: reminderDate,
    });
  }
}

// Función para cancelar todas las notificaciones programadas
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Función para enviar una notificación inmediata
export async function sendImmediateNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null,
  });
}