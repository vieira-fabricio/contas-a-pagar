import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeDatabase } from './src/database/initializeDatabase';
//import * as Sentry from '@sentry/react-native';

import Home from './src/screens/Home';
import CadastroConta from './src/screens/CadastroConta';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

const Stack = createNativeStackNavigator();

/*Sentry.init({
  dsn: 'https://9f728a520d774afdbed158e74b73c20b@o4511305562914816.ingest.us.sentry.io/4511305566584832',
  debug: true, // Útil em desenvolvimento para ver se o Sentry está conectado
});*/

export default function App() {

  useEffect(() => {
    // Inicializa o banco e as permissões de notificação logo ao abrir
    initializeDatabase();
    registerForPushNotificationsAsync()
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Minhas Contas' }} 
        />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroConta} 
          options={{ title: 'Nova Conta' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//export default Sentry.wrap(App);
