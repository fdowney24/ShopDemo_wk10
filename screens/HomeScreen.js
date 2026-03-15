// HomeScreen
// - Purpose: Simple welcome screen with navigation to Inventory screen.
// - Props:
//    - navigation: react-navigation prop used to navigate to other screens
// - Output: renders a welcome message and a button to go to Inventory.

import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import useBasket from '../hooks/useBasket';
import useNotifications from '../hooks/useNotifications';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { basket, loadBasket } = useBasket('demo-user-1');
  const { expoPushToken } = useNotifications(); // registers handler, requests permission, and sets up Android channel
  const { logout } = useAuth();
  const hasSentPushToken = useRef(false);

  // After login, register the push token with the backend once per session.
  useEffect(() => {
    if (expoPushToken && !hasSentPushToken.current) {
      hasSentPushToken.current = true;
      authApi.postPushToken(expoPushToken)
        .then(() => console.log('[Auth] Push token registered with backend'))
        .catch(err => console.warn('[Auth] Push token registration failed:', err));
    }
  }, [expoPushToken]);

  // Load the basket on mount and every time the screen comes back into focus.
  useEffect(() => {
    loadBasket().catch(() => {});
    const unsubscribe = navigation.addListener('focus', () => {
      loadBasket().catch(() => {});
    });
    return unsubscribe;
  }, [navigation]);

  // Remind the user if they have items in the basket.
  useEffect(() => {
    const itemCount = basket?.items?.length ?? 0;
    if (itemCount > 0) {
      // Uncomment to prevent duplicate notifications if the user navigates back and forth.
      // Notifications.cancelAllScheduledNotificationsAsync();
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Items in your basket',
          body: `You have ${itemCount} item(s) waiting — don't forget to checkout!`,
          channelId: 'default',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
      });
    }
  }, [basket]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Welcome to ShopDemo</Text>
        <View style={{ height: 8 }} />
        <Button title="Browse Products" onPress={() => navigation.navigate('ProductBrowser')} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.text}>Manage your inventory from the Inventory screen.</Text>
        <View style={{ height: 12 }} />
        <View style={{ width: '100%', maxWidth: 360 }}>
          <Button title="Go to Inventory" onPress={() => navigation.navigate('Inventory')} />
        </View>
        <View style={{ height: 12 }} />
        <View style={{ width: '100%', maxWidth: 360 }}>
          <Button title="Logout" color="#d9534f" onPress={logout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingBottom: 24, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  text: { marginBottom: 16, color: '#444' },
});
