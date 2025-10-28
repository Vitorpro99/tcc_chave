# Instruções para Agentes de IA - TCC Chave

## Arquitetura do Projeto

Este é um projeto full-stack dividido em duas partes principais:

### Frontend (diretório `/front`)
- Aplicação Next.js usando o sistema de páginas (não App Router)
- Estilização via CSS Modules (`.module.css`)
- Componentes principais em `/front/src/components`
- Páginas em `/front/src/pages`
- Serviços API em `/front/src/services`

### Backend (raiz do projeto)
- API REST usando Express.js
- ORM Sequelize para gerenciamento do banco de dados
- Modelos em `/models`
- Controladores em `/controllers`
- Rotas em `/routes`

## Padrões e Convenções

### Estrutura de Componentes
- Cada componente tem seu próprio diretório com:
  - `index.js` para o código React
  - `*.module.css` para estilos específicos
  Exemplo: `/front/src/components/modalVeiculo/`

### Estilização
- Cores primárias: #C42020 (vermelho), #28a745 (verde)
- Botões seguem padrão consistente com hover effects
- Layout responsivo usando CSS Grid e Flexbox

### Modelos de Dados
- Modelos Sequelize em `/models` definem a estrutura do banco
- Convenção de nomes em português
- Campos comuns: createdAt, updatedAt (automáticos do Sequelize)

## Fluxo de Desenvolvimento

1. Iniciar o backend:
```bash
npm install
node server.js
```

2. Iniciar o frontend (em `/front`):
```bash
npm install
npm run dev
```

3. Acessar:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Pontos de Integração

- Frontend se comunica com backend via axios (configurado em `/front/src/services/api.js`)
- CORS configurado para permitir apenas localhost:3000
- Rotas da API seguem padrão RESTful para cada recurso (veículos, usuários, etc.)

## Estrutura de Arquivos Chave
- `server.js`: Configuração principal do servidor Express
- `/models/index.js`: Configuração do Sequelize e conexões
- `/front/src/pages/index.js`: Página inicial da aplicação
- `/front/src/components/`: Componentes reutilizáveis