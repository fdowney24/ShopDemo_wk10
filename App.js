// App
// - Purpose: Application entry point. Sets up React Navigation with Home and Inventory screens.
// - Output: NavigationContainer with stack navigator containing `Home` and `Inventory`.

import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProductBrowser from './screens/ProductBrowser';
import ProductBasket from './screens/ProductBasket';

const Stack = createNativeStackNavigator();

export default function App() {
  // A ref to the navigator so we can navigate from outside a screen component.
  const navigationRef = useRef(null);

  useEffect(() => {
    // Navigate to the basket when the user taps a notification.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
      console.log('[Notification tapped] navigating to basket');
      navigationRef.current?.navigate('ProductBasket');
    });
    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
        <Stack.Screen name="ProductBrowser" component={ProductBrowser} options={{ title: 'Products' }} />
        <Stack.Screen name="ProductBasket" component={ProductBasket} options={{ title: 'Basket' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
