import * as SQLite from 'expo-sqlite';

export async function initializeDatabase() {
    const db = await SQLite.openDatabaseAsync('financeiro.db');

    // Criamos a tabela de contas se ela não existir
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS contas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            valor REAL NOT NULL,
            data_vencimento TEXT NOT NULL,
            pago INTEGER DEFAULT 0
        );
    `);
    
    return db;
}