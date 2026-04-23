import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeDatabase } from './src/database/initializeDatabase';

import Home from './src/screens/Home';
import CadastroConta from './src/screens/CadastroConta';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Inicializa o banco e as permissões de notificação logo ao abrir
    initializeDatabase();
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
