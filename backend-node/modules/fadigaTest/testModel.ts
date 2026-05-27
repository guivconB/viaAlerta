import { db } from "../../src/utils/mysql.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export type TestData = {
  userId: number;
  testType: 'REFLEX' | 'SEQUENCE' | 'STROOP';
  score: number;
  status: 'EXCELENTE' | 'BOM' | 'ALERTA' | 'PERIGO';
};

// Auto-create table logic
const createTableIfNotExists = async () => {
  try {
    // Drop old table to avoid ENUM conflicts when status text changes
    await db.execute(`DROP TABLE IF EXISTS fatigue_tests`);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fatigue_tests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        testType ENUM('REFLEX', 'SEQUENCE', 'STROOP') NOT NULL,
        score INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Tabela fatigue_tests pronta.");
  } catch (error) {
    console.error("Erro ao tentar criar a tabela fatigue_tests", error);
  }
};

// Chama imediatamente na importação
createTableIfNotExists();

export const insertTest = async (data: TestData) => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO fatigue_tests (userId, testType, score, status) VALUES (?, ?, ?, ?)`,
    [data.userId, data.testType, data.score, data.status]
  );
  return result.insertId;
};

export const getUserTests = async (userId: number) => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, testType as type, score, status, createdAt as date
     FROM fatigue_tests 
     WHERE userId = ? 
     ORDER BY createdAt DESC`,
    [userId]
  );
  return rows;
};
