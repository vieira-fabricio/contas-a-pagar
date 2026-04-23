// src/screens/Home.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { formatDateToBR, formatCurrency } from '../utils/formatters';
import { listarNotificacoesAgendadas } from '../services/notificationService';
import { enviarEmailVencimento } from '../services/emailService';

export default function Home({ navigation }) {
  const [contas, setContas] = useState([]);

  const carregarContas = async () => {
    const db = await SQLite.openDatabaseAsync('financeiro.db');
    const todas = await db.getAllAsync('SELECT * FROM contas ORDER BY data_vencimento ASC');
    setContas(todas);

    const verificarAlertasPorEmail = async (contas) => {
      const hoje = new Date();
  
      for (const conta of contas) {
        const vencimento = new Date(conta.data_vencimento);
        const diffTime = vencimento - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se faltar 1 ou 2 dias e a conta não estiver paga
        if (diffDays <= 2 && diffDays >= 0 && !conta.pago) {
          console.log(`Disparando alerta de e-mail para: ${conta.titulo}`);
          await enviarEmailVencimento(conta.titulo, conta.valor, conta.data_vencimento);
        }
      }
    };
  };

  useFocusEffect(useCallback(() => { 
    carregarContas(); 
    listarNotificacoesAgendadas();
  }, []));

  const removerConta = async (id) => {
    Alert.alert("Excluir", "Deseja remover esta conta?", [
      { text: "Não" },
      { text: "Sim", onPress: async () => {
          const db = await SQLite.openDatabaseAsync('financeiro.db');
          await db.runAsync('DELETE FROM contas WHERE id = ?', [id]);
          carregarContas();
      }}
    ]);
  };

  const marcarComoPaga = async (id) => {
    const db = await SQLite.openDatabaseAsync('financeiro.db');
    await db.runAsync('UPDATE contas SET pago = 1 WHERE id = ?', [id]);
    carregarContas();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.pago && styles.cardPago]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.subtitulo}>Vencimento: {formatDateToBR(item.data_vencimento)}</Text>
        <Text style={styles.valor}>{formatCurrency(item.valor)}</Text>
      </View>
      
      <View style={styles.acoes}>
        {!item.pago && (
          <TouchableOpacity style={styles.botaoPagar} onPress={() => marcarComoPaga(item.id)}>
            <Ionicons name="checkmark-done" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => removerConta(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={contas} keyExtractor={(t) => t.id.toString()} renderItem={renderItem} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Cadastro')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 3 },
  cardPago: { opacity: 0.6, backgroundColor: '#e8f5e9' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitulo: { color: '#666', fontSize: 14 },
  valor: { fontSize: 16, color: '#2e7d32', fontWeight: 'bold', marginTop: 4 },
  acoes: { flexDirection: 'row', alignItems: 'center' },
  botaoPagar: { backgroundColor: '#2e7d32', padding: 8, borderRadius: 20, marginRight: 15 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2e7d32', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});