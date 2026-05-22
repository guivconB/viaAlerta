# viaAlerta 🚗🚦

Aplicativo focado na conscientização e segurança viária, desenvolvido especialmente para apoiar o Maio Amarelo. O viaAlerta ajuda a prevenir acidentes causados por fadiga (através de testes rápidos de reflexo) e permite o mapeamento colaborativo de problemas na infraestrutura urbana.

## 📱 Estrutura do Projeto

O projeto adota uma arquitetura full-stack moderna, sendo dividido em duas pastas principais:

- **`/mobile`**: O aplicativo frontend, construído com **React Native** e **Expo** (TypeScript). Interface focada em Dark Mode para conforto visual do motorista, componentes reutilizáveis e navegação via React Navigation.
- **`/backend-node`**: O servidor da API, construído com **Node.js**, **Express**, e **TypeScript**. A persistência de dados é garantida pelo **MySQL** utilizando o **Prisma ORM**.

A estrutura de pastas foi rigorosamente pensada seguindo os princípios de separação de responsabilidades (Clean Code), separando rotas de visualização (screens) no front e padrões MVC (controllers/routes) no back, facilitando o trabalho em equipe.

## 🚀 Como Iniciar o Projeto (Guia para a Equipe)

Siga os passos abaixo para rodar o projeto localmente na sua máquina.

### 1. Configurando o Banco de Dados (MySQL)
1. Certifique-se de ter o MySQL instalado e rodando na sua máquina (porta `3306`).
2. Crie um banco de dados vazio chamado `via_alerta` no seu SGBD (DBeaver, MySQL Workbench, XAMPP, etc).

### 2. Rodando o Backend (API)
1. Abra o terminal e entre na pasta do backend:
   ```bash
   cd backend-node
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `backend-node` (baseado no `schema.prisma`) com sua string de conexão:
   ```env
   DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/via_alerta"
   JWT_SECRET="super-secret-key-via-alerta"
   PORT=3000
   ```
4. Gere as tabelas do banco de dados utilizando o Prisma:
   ```bash
   npx prisma db push
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   # ou utilize o ts-node diretamente: npx ts-node src/server.ts
   ```

### 3. Rodando o Frontend (App Mobile)
1. Abra um **novo terminal** e entre na pasta do mobile:
   ```bash
   cd mobile
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
4. Um QR Code aparecerá no terminal. Você pode escaneá-lo usando o aplicativo **Expo Go** no seu celular (conectado no mesmo Wi-Fi), ou apertar a tecla `a` no terminal para abrir em um emulador Android.

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React Native, Expo, React Navigation, Axios.
- **Backend**: Node.js, Express, TypeScript, JWT (Autenticação).
- **Banco de Dados**: MySQL, Prisma ORM.

---
*Projeto em desenvolvimento ativo. Criado para o Maio Amarelo.*