# viaAlerta 🚗🚦

Aplicativo mobile focado na conscientização e segurança viária, desenvolvido especialmente para apoiar a campanha do Maio Amarelo. O **viaAlerta** previne acidentes causados por fadiga do motorista através de testes de prontidão cognitiva avançados (Módulo Fadiga Zero V2) e mapeia de forma colaborativa problemas na infraestrutura urbana (Módulo Via Alerta Pro).

---

## 📱 Funcionalidades Principais

### 🧠 1. Módulo Fadiga Zero V2 (Prontidão Mental & Haptics)
Avaliamos a capacidade cognitiva do motorista antes de assumir o volante através de três minijogos de precisão:
*   **Tempo de Reação Visual:** O usuário toca na tela assim que ela mudar de cor. A tela emite uma vibração forte instantânea ao disparar o estímulo verde para alertar condutores desatentos.
*   **Sequência de Memória (Simon Says):** Testa a memória de curto prazo piscando blocos em ordem aleatória. Possui feedbacks táteis integrados para acompanhar cada etapa e padrões táteis de erro.
*   **Teste de Stroop (Atenção Seletiva):** Exibe palavras escritas em fontes de cores diferentes (ex: a palavra "AZUL" escrita na cor vermelha). O usuário tem apenas **3 segundos** para responder a cor correta com o auxílio de uma barra de progresso rápida e haptics de validação.

### 🗺️ 2. Módulo Via Alerta Pro (Mapeamento & Mídia - Aracaju SE)
Mapeamento de perigos na via focado na comunidade e credibilidade urbana, totalmente ambientado em **Aracaju - SE**:
*   **Geolocalização Automática via GPS (`expo-location`):** Captura de latitude/longitude e geocodificação reversa instantânea do endereço (rua/bairro) ao iniciar um alerta. Emuladores e simulações possuem fallback automático para a **Orla de Atalaia**.
*   **Mapa de Ocorrências Interativo (`react-native-maps`):** Alternância em tempo real entre Feed em Lista e Mapa de Calor dinâmico focado em Aracaju. Pinos de alerta são coloridos de acordo com a categoria e gravidade (Buracos, Acidentes, Semáforos e Iluminação).
*   **Câmera e Upload de Fotos (`expo-image-picker`):** Integração com câmera física e galeria do celular para anexar fotos de evidências.
*   **Validação Comunitária:** Botões interativos reativos de *"Eu vi isso também" (Upvote)* e *"Resolvido"* para dar relevância e controlar a expiração de alertas gerados pela comunidade.

---

## 🛠️ Tecnologias & Arquitetura do Projeto

O projeto é dividido em duas pastas principais:

### 📱 Frontend (`/mobile`)
*   **React Native** com **Expo** (TypeScript) compatível com Android/iOS.
*   **Navegação e Layout**: React Navigation (Stack) com temas de Dark Mode focados no conforto do condutor à noite.
*   **Sensores & APIs Nativas**: `expo-location` (GPS), `expo-image-picker` (Mídia/Câmera), `react-native-maps` (Geoprocessamento) e `Vibration` API.
*   **Serviço Reativo Local**: Implementação de padrão Pub-Sub em `reports.ts` que sincroniza as ações de mapas, imagens e votos em tempo real.

### 🔌 Backend (`/backend-node`)
*   **Node.js**, **Express** e **TypeScript**.
*   **Acesso a Dados**: Banco **MySQL** integrado usando SQL puro (`mysql2/promise`) para máxima performance, eliminando a dependência do Prisma ORM (removido para maior estabilidade e leveza).

---

## 🚀 Como Iniciar o Projeto (Guia de Instalação)

### 1. Configurando o Banco de Dados (MySQL)
1. Certifique-se de ter o MySQL instalado e rodando na porta `3306`.
2. Crie um banco de dados vazio chamado `via_alerta`.
3. Siga o guia [backend_integration_guide.md](file:///C:/Users/guivc/.gemini/antigravity/brain/2806877f-f495-47e2-94c4-343600fdcee3/backend_integration_guide.md) para a criação das tabelas em SQL puro.

### 2. Rodando o Backend (API)
```bash
cd backend-node
npm install
npm run dev
```

### 3. Rodando o Frontend (App Mobile)
```bash
cd mobile
npm install
npx expo start
```
*Aperte a tecla `a` para abrir no emulador Android ou escaneie o QR code com o app **Expo Go** para testar em seu celular físico e sentir os feedbacks de vibração física.*

---
*Projeto sob desenvolvimento ativo focando em salvar vidas e melhorar a infraestrutura urbana no Maio Amarelo.*