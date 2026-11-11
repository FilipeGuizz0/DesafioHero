# HeroForce

[![CI](https://github.com/FilipeGuizz0/DesafioHero/actions/workflows/ci.yml/badge.svg)](https://github.com/FilipeGuizz0/DesafioHero/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=16181D)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Portal fullstack para gestão de projetos heroicos, desenvolvido para o desafio técnico da Innova Connect. A aplicação permite cadastrar heróis, autenticar usuários, acompanhar projetos e administrar missões por status, responsável, metas e percentual de conclusão.

## Tecnologias

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL, JWT e Swagger
- **Frontend:** React, TypeScript, Vite, Axios e CSS responsivo
- **Qualidade:** Jest, Vitest, Testing Library, Supertest e PostgreSQL em memória com pg-mem
- **Ambiente:** Docker e Docker Compose

## Funcionalidades

- Cadastro e login de heróis com senha criptografada
- Autenticação JWT e controle de acesso por perfil (`hero` e `admin`)
- CRUD de projetos restrito a administradores
- Listagem de projetos para usuários autenticados
- Filtros por status e herói, além de busca textual
- Metas de agilidade, encantamento, eficiência, excelência, transparência e ambição
- Painel com indicadores e percentual médio de conclusão
- Layout responsivo para desktop, tablet e celular
- Documentação interativa da API com Swagger

## Execução rápida com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Passos

1. Clone o repositório e acesse a pasta:

```bash
git clone https://github.com/FilipeGuizz0/DesafioHero.git
cd DesafioHero
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Inicie a aplicação:

```bash
docker compose up --build
```

4. Acesse:

- Aplicação: [http://localhost:5173](http://localhost:5173)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
- API: [http://localhost:3000/api](http://localhost:3000/api)

### Usuário administrador inicial

```text
E-mail: admin@heroforce.com
Senha: Admin@123
```

As credenciais podem ser alteradas no `.env`. O administrador é criado automaticamente apenas quando ainda não existe um usuário com o e-mail configurado.

## Execução sem Docker

É necessário ter Node.js 22+ e uma instância PostgreSQL disponível.

1. Copie `.env.example` para `.env` e ajuste as variáveis do banco.
2. Instale todas as dependências:

```bash
npm run install:all
```

3. Em dois terminais, execute:

```bash
npm run dev:backend
npm run dev:frontend
```

## Testes e build

O projeto possui **35 testes automatizados** entre testes unitários, testes de componentes, validação HTTP e um fluxo de integração com PostgreSQL em memória. Eles cobrem autenticação, autorização por perfil, usuários, projetos, filtros, indicadores e formulários.

```bash
# Testes do backend e frontend
npm test

# Build de produção dos dois projetos
npm run build
```

Também é possível executar separadamente:

```bash
npm run test --prefix backend
npm run test --prefix frontend
npm run lint --prefix backend
npm run lint --prefix frontend
npm run test:cov --prefix backend
npm run test:coverage --prefix frontend
```

## Principais endpoints

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Público | Cadastra um herói |
| POST | `/api/auth/login` | Público | Autentica e retorna o JWT |
| GET | `/api/auth/profile` | Autenticado | Retorna o perfil atual |
| GET | `/api/heroes` | Autenticado | Lista os heróis |
| GET | `/api/projects` | Autenticado | Lista e filtra projetos |
| GET | `/api/projects/:id` | Autenticado | Detalha um projeto |
| POST | `/api/projects` | Admin | Cria um projeto |
| PATCH | `/api/projects/:id` | Admin | Edita um projeto |
| DELETE | `/api/projects/:id` | Admin | Remove um projeto |

Os filtros disponíveis em `GET /api/projects` são `status` e `responsibleId`.

## Estrutura

```text
hero-force/
├── backend/              # API NestJS
│   ├── src/auth/         # Autenticação e JWT
│   ├── src/users/        # Heróis e perfis
│   └── src/projects/     # Projetos, metas e filtros
├── frontend/             # SPA React + Vite
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── docker-compose.yml
└── .env.example
```

## Decisões técnicas

- As senhas são armazenadas com `bcrypt` e nunca retornam pela API.
- A estratégia JWT consulta o usuário no banco a cada requisição, invalidando usuários removidos e respeitando alterações de perfil imediatamente.
- O backend valida e remove campos não previstos nos DTOs.
- Identificadores inválidos são rejeitados antes de chegar ao banco de dados.
- Um administrador não pode excluir o próprio usuário nem remover um herói responsável por projetos.
- As rotas de escrita usam autorização por perfil; heróis podem consultar as missões e administradores podem gerenciá-las.
- `DATABASE_SYNCHRONIZE=true` facilita a avaliação local. Em produção, recomenda-se desativar essa opção e versionar o banco com migrations.
- O token fica no `localStorage` para simplificar a execução do desafio. Em uma aplicação pública, cookies `httpOnly` com proteção CSRF seriam preferíveis.

## Autor

Filipe Guizzo Soares
