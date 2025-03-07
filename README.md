# API - Sistema de Atividades

Este é um backend simples de gerenciamento de atividades, onde usuários podem se registrar, fazer login, visualizar atividades disponíveis e se inscrever nelas.

## Requisitos

- **Node.js**.
- **RocksDB**.

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Math-mach/Projeto_API_Matheus_Machtura.git
   cd Projeto API
   ```

2. **Instale as dependências:**

   Se você estiver utilizando **npm**:

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   PORT=3000
   JWT_SECRET=supersecreto
   SALT_ROUNDS=10
   DBSTORAGE=./database
   ```

4. **Inicie o servidor:**

   Para iniciar a aplicação em modo de desenvolvimento:

   ```bash
   npm start
   ```

   O servidor estará rodando em `http://localhost:3000`.

## Endpoints

Aqui estão os principais endpoints da API:

### 1. **POST /auth/register**

Cria um novo usuário.

**Requisição:**

- **Body (JSON):**

  ```json
  {
    "email": "belbel@gmail.com",
    "password": "@petisco136"
  }
  ```

**Resposta (200 OK):**

```json
{
  "message": "Usuário criado com sucesso"
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Campos obrigatórios faltando"
}
```

### 2. **POST /auth/login**

Autentica um usuário e gera um token JWT, retornado como um cookie.

**Requisição:**

- **Body (JSON):**

  ```json
  {
    "email": "belbel@gmail.com",
    "password": "@petisco136"
  }
  ```

**Resposta (200 OK):**

- Retorna um token JWT como cookie `token`.

```json
{
  "message": "Login bem-sucedido",
  "userId": "1234"
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Credenciais inválidas"
}
```

### 3. **GET /activities**

Retorna todas as atividades disponíveis.

**Resposta (200 OK):**

```json
[
  {
    "id": 1234,
    "title": "Atividade de Exemplo",
    "description": "Descrição da atividade",
    "date": "2025-03-06T12:00:00Z",
    "maxP": 10,
    "status": "open",
    "participants": []
  }
]
```

### 4. **POST /activities/join/:id**

Inscreve um usuário em uma atividade, usando o `id` da atividade.

**Requisição:**

- **Body (JSON):**

  ```json
  {
    "userId": 1234
  }
  ```

**Resposta (200 OK):**

```json
{
  "message": "Inscrição realizada com sucesso"
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Atividade lotada"
}
```

### 5. **POST /activities/leave/:id**

Remove um usuário de uma atividade, usando o `id` da atividade.

**Requisição:**

- **Body (JSON):**

  ```json
  {
    "userId": 1234
  }
  ```

**Resposta (200 OK):**

```json
{
  "message": "Inscrição cancelada com sucesso"
}
```

## Middleware de Autenticação

Para proteger as rotas que exigem um usuário autenticado, a API utiliza o **JWT** (JSON Web Token). O token é armazenado como um **cookie** com a flag `httpOnly`.

Quando um usuário fizer login, o token será automaticamente armazenado no cookie, e em requisições subsequentes, o token será verificado para garantir que o usuário está autenticado.

## Configuração de Cookies

- **httpOnly**: Impede que o JavaScript acesse o cookie.
- **secure**: Garantir que o cookie seja enviado apenas via HTTPS (em produção).
- **sameSite**: Impede o envio do cookie em requisições de terceiros (protege contra CSRF).

---

## Logout

### 1. **POST /auth/logout**

Esse endpoint remove o token JWT do cookie, efetivamente desconectando o usuário.

**Requisição:**

- Nenhuma.

**Resposta (200 OK):**

```json
{
  "message": "Logout bem-sucedido"
}
```

---

## Testes

Para testar os endpoints da API, você pode usar ferramentas como o **Postman** ou **Insomnia**.

1. **Registrar um novo usuário:**

   - URL: `POST http://localhost:3000/auth/register`
   - Body: JSON com os dados do usuário.

2. **Fazer login:**

   - URL: `POST http://localhost:3000/auth/login`
   - Body: JSON com os dados do login.
   - O token será enviado como cookie.

**Necessário estar autenticado (token no cookie).**

3. **Listar atividades:**

   - URL: `GET http://localhost:3000/activities`

4. **Inscrever-se em uma atividade:**

   - URL: `POST http://localhost:3000/activities/join/:id`
   - Body: JSON com `userId`.

5. **Cancelar inscrição em uma atividade:**
   - URL: `POST http://localhost:3000/activities/leave/:id`
   - Body: JSON com `userId`.
