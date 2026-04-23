// src/screens/CadastroConta.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerCommunity from '@react-native-community/datetimepicker'; 
import * as SQLite from 'expo-sqlite';
import { scheduleBillNotification } from '../services/notificationService';
import { formatDateToISO, formatDateToBR } from '../utils/formatters';

export default function CadastroConta({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeData = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setData(selectedDate);
  };

  async function salvarConta() {
    if (!titulo || !valor) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync('financeiro.db');
      const dataISO = formatDateToISO(data);

      await db.runAsync(
        'INSERT INTO contas (titulo, valor, data_vencimento) VALUES (?, ?, ?)',
        [titulo, parseFloat(valor.replace(',', '.')), dataISO]
      );

      // Agendamento com o novo trigger corrigido
      try {
        await scheduleBillNotification(titulo, dataISO);
        Alert.alert("Sucesso", "Conta cadastrada e lembrete agendado!");
      } catch (e) {
        console.warn("Erro no agendamento:", e);
        Alert.alert("Aviso", "Conta salva, mas não foi possível agendar o lembrete.");
      }

      Alert.alert("Sucesso", "Conta cadastrada!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar no banco.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Conta</Text>
      <TextInput style={styles.input} placeholder="Ex: Internet" value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Valor</Text>
      <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={valor} onChangeText={setValor} />

      <Text style={styles.label}>Vencimento</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{formatDateToBR(formatDateToISO(data))}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePickerCommunity value={data} mode="date" display="default" onChange={onChangeData} minimumDate={new Date()} />
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Salvar Conta" onPress={salvarConta} color="#2e7d32" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 5, marginTop: 5 },
});