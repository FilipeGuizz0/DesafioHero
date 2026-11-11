# Checklist de teste e entrega

## 1. Testar o projeto

Na raiz do projeto, copie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Suba os três serviços:

```bash
docker compose up --build
```

A primeira compilação pode levar alguns minutos. Quando terminar, abra:

- Frontend: http://localhost:5173
- Swagger: http://localhost:3000/docs

Entre com:

```text
admin@heroforce.com
Admin@123
```

## 2. Conferir as funcionalidades

- [ ] Entrar com o administrador
- [ ] Criar um projeto e selecionar um responsável
- [ ] Editar status, metas e percentual de conclusão
- [ ] Filtrar por status e responsável
- [ ] Excluir um projeto
- [ ] Cadastrar um novo herói pela tela de registro
- [ ] Entrar com o novo herói e confirmar que ele apenas visualiza os projetos
- [ ] Abrir a aplicação no celular ou reduzir a janela para conferir o layout responsivo
- [ ] Abrir o Swagger e testar um endpoint autenticado com o token JWT

Para rodar os testes automatizados:

```bash
npm run install:all
npm test
npm run build
```

## 3. Verificação automática

O GitHub Actions executa lint, build e todos os testes automaticamente a cada `push` ou `pull request` para a branch `main`. Antes de compartilhar a entrega, confirme na aba **Actions** que a execução está verde.

## 4. Caso ainda vá evoluir o projeto

Mantenha os próximos ajustes em commits separados e objetivos, por exemplo:

```text
feat: adiciona autenticação e controle de acesso
feat: implementa gestão de projetos e filtros
feat: cria dashboard responsivo
test: adiciona testes de autenticação e projetos
docs: documenta execução e endpoints
```

Mantenha os próximos ajustes em commits separados e verdadeiros. Um histórico curto e claro é melhor do que vários commits artificiais.

## 5. Entrega

Com a aplicação testada e a automação aprovada, compartilhe este endereço:

https://github.com/FilipeGuizz0/DesafioHero


