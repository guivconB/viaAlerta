import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL não definido em .env');
  process.exit(1);
}

async function run() {
  const db = await mysql.createPool({
    uri: connectionString,
  });

  try {
    console.log('Adicionando coluna role...');
    await db.execute("ALTER TABLE users ADD COLUMN role ENUM('USER', 'ADMIN') DEFAULT 'USER'");
    console.log('Coluna adicionada com sucesso.');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Coluna role já existe. Ignorando...');
    } else {
      console.error('Erro ao adicionar coluna:', err.message);
    }
  }

  try {
    console.log('Promovendo guivcon@gmail.com para ADMIN...');
    const [result] = await db.execute("UPDATE users SET role = 'ADMIN' WHERE email = 'guivcon@gmail.com'");
    console.log('Usuário atualizado com sucesso!', result);
  } catch (err: any) {
    console.error('Erro ao atualizar usuário:', err.message);
  }

  await db.end();
}

run();
