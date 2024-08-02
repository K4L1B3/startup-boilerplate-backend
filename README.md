# 🚀 Projeto Boilerplate para Startups


<div display="inline" align="center">
<img src="https://img.shields.io/static/v1?label=Version&message=1.0&color=7159c1&style=for-the-badge&logo=ghost"/>
<img src="https://img.shields.io/static/v1?label=Progress&message=100%&color=7159c1&style=for-the-badge&logo=ghost"/>
<img src="https://img.shields.io/static/v1?label=Contribution&message=Closed&color=7159c1&style=for-the-badge&logo=ghost"/>
<img src="https://img.shields.io/static/v1?label= Project Stats &message=All right&color=00FF55&style=for-the-badge&logo=ghost"/>
</div>

# Índice
<p align="center">
 <a href="#introdução">Introdução</a> •
 <a href="#funcionalidades">Funcionalidades</a> • 
 <a href="#estrutura-do-projeto">Estrutura do Projeto</a> • 
 <a href="#primeiros-passos">Primeiros Passos</a> •  
 <a href="#documentação-da-api">Documentação da API</a> •  
 <a href="#contribuição">Contribuição</a> •
 <a href="#licença">Licença</a> •
 <a href="#contato">Contato</a>
</p>
<br/>

## Introdução

Bem-vindo ao **Projeto Boilerplate para Startups**! 🎉 Este projeto visa acelerar o desenvolvimento da sua startup, fornecendo um boilerplate robusto e pronto para uso. Entendemos que uma parte significativa do tempo de desenvolvimento é gasta em configuração, autenticação e outras tarefas fundamentais. Nosso boilerplate aborda esses desafios, permitindo que você se concentre na construção de suas principais funcionalidades. 🚀

## Funcionalidades

### Ambientes de Desenvolvimento e Produção

- **SQLite3**: Um ambiente de desenvolvimento otimizado para aumentar a produtividade. 💻
- **Postgres**: Um ambiente pronto para produção, otimizado para escalabilidade. 📈

### Containers

- **Docker**: Containers Docker pré-configurados para fácil implantação e gerenciamento. 🐳

### Autenticação

- **JWT**: JSON Web Token para autenticação segura. 🔐
- **Passport**: Middleware de autenticação abrangente. 🛂
- **Passport Google Auth 20**: Simplifica a integração do login com o Google. 📲

### E-mail

- **Mailer**: Para envio e gerenciamento eficaz de e-mails. 📧

### Integração de API

- **Open.Ai**: API de IA integrada. 🤖
- **Stripe API**: Integração pré-configurada com o Stripe para processamento de pagamentos. 💳

### Documentação

- **Swagger**: Documentação de API gerada automaticamente. 📜

### Banco de Dados

- **TypeORM**: Gerenciamento eficiente de banco de dados. 💾
- **SQLite 3**: Banco de dados leve para desenvolvimento. 🗃️

### Utilitários

- **Axios**: Cliente HTTP baseado em Promises. 🌐
- **Class Transformer**: Para transformar objetos simples em instâncias de classes. 🔄
- **Class Validator**: Decorador poderoso para validação de propriedades de classe. ✔️

### Segurança

- **Helmet**: Middleware de segurança para proteger sua aplicação. 🛡️

### Qualidade de Código

- **Husky**: Ganchos de pré-commit para manter a qualidade do código. 🐶
- **ESLint**: Ferramenta de linting para identificar e relatar padrões no JavaScript. 📏
- **Prettier**: Formatador de código para um estilo consistente. 💅

### Internacionalização

- **I18N**: Suporte para internacionalização. 🌍

### Logs

- **Nest Winston**: Integração de logging com Winston para melhor gerenciamento de logs. 📝

### Agendamento

- **Node.Cron**: Agendamento de tarefas para execução em intervalos específicos. ⏰

### Testes

- **Jest**: Framework de testes para JavaScript. 🧪

## Estrutura do Projeto

Este projeto é construído usando **NestJS** e **TypeScript**, garantindo uma estrutura bem organizada e modular. Aqui está uma breve visão geral dos principais componentes:

- **Módulos**: Cada funcionalidade ou domínio é encapsulado em um módulo. 📦
- **Controladores**: Lidam com solicitações recebidas e retornam respostas. 🎮
- **Serviços**: Contêm a lógica de negócios. 🛠️
- **Entidades**: Representam entidades do banco de dados. 🗄️
- **DTOs**: Objetos de Transferência de Dados para validação e transformação de dados. 🔄
- **Repositórios**: Gerenciam a lógica de acesso a dados. 💽
- **Interfaces**: Definem contratos para tipos e classes. 📑

Por exemplo, o módulo de usuário terá:

- `UserController`
- `UserService`
- `UserModule`
- `UserRepository`
- `UserEntity`
- `UserDTO`

## Primeiros Passos

0. **OBS: Adicione todas as suas variáveis de ambiente (recomendo ler o arquivo .envExemple)**

1. **Clone o repositório**:
   ```sh
   git clone https://github.com/your-repo/startup-boilerplate.git
   cd startup-boilerplate-backend
   ```

2. **Instale as dependências**:
   ```sh
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```sh
   npm run start:dev
   ```

4. **Limpe e construa o projeto para produção**:
   ```sh
   npm run cleanAndBuild
   ```

5. **Execute os testes**:
   ```sh
    $ npm run test
    
    # e2e tests
    $ npm run test:e2e
    
    # test coverage
    $ npm run test:cov   
   ```


Claro, vou adicionar as respostas que cada endpoint retorna na documentação.

---

## Documentação da API

### Endpoints de Usuário

#### Obter Todos os Usuários

```http
GET /user/getUsers
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key`   | `string`   | **Obrigatório**. A chave da sua API |

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "phone": "+5511999999999",
    "role": "User",
    "plan": "Basic",
    "profilePicture": "assets/ProfilePictureDefault/profile.png",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  ...
]
```

#### Obter um Usuário pelo Email

```http
GET /user/getUserByEmail/:email
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`     | `string`   | **Obrigatório**. O email do usuário que você quer |

**Resposta:**

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "+5511999999999",
  "role": "User",
  "plan": "Basic",
  "profilePicture": "assets/ProfilePictureDefault/profile.png",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Criar um Usuário

```http
POST /user/createUser
```

| Parâmetro      | Tipo       | Descrição                                   |
| :------------- | :--------- | :------------------------------------------ |
| `name`         | `string`   | **Obrigatório**. Nome do usuário            |
| `email`        | `string`   | **Obrigatório**. Email do usuário           |
| `phone`        | `string`   | **Obrigatório**. Telefone do usuário        |
| `password`     | `string`   | **Obrigatório**. Senha do usuário           |
| `location`     | `string`   | **Opcional**. Localização do usuário        |
| `profilePicture` | `string` | **Opcional**. URL da foto de perfil do usuário |

**Resposta:**

```json
{
  "id": 2,
  "name": "Maria Silva",
  "email": "maria.silva@example.com",
  "phone": "+5511988888888",
  "role": "User",
  "plan": "Basic",
  "profilePicture": "assets/ProfilePictureDefault/profile.png",
  "createdAt": "2023-01-02T00:00:00.000Z"
}
```

#### Atualizar um Usuário

```http
PUT /user/updateUser/:id
```

| Parâmetro      | Tipo       | Descrição                                   |
| :------------- | :--------- | :------------------------------------------ |
| `id`           | `number`   | **Obrigatório**. ID do usuário              |
| `name`         | `string`   | **Opcional**. Nome do usuário               |
| `email`        | `string`   | **Opcional**. Email do usuário              |
| `phone`        | `string`   | **Opcional**. Telefone do usuário           |
| `password`     | `string`   | **Opcional**. Senha do usuário              |
| `location`     | `string`   | **Opcional**. Localização do usuário        |
| `profilePicture` | `string` | **Opcional**. URL da foto de perfil do usuário |

**Resposta:**

```json
{
  "id": 2,
  "name": "Maria Silva",
  "email": "maria.silva@example.com",
  "phone": "+5511988888888",
  "role": "User",
  "plan": "Basic",
  "profilePicture": "assets/ProfilePictureDefault/profile.png",
  "createdAt": "2023-01-02T00:00:00.000Z"
}
```

#### Atualizar Próprio Usuário

```http
PUT /user/updateUserSelf
```

| Parâmetro      | Tipo       | Descrição                                   |
| :------------- | :--------- | :------------------------------------------ |
| `name`         | `string`   | **Opcional**. Nome do usuário               |
| `email`        | `string`   | **Opcional**. Email do usuário              |
| `phone`        | `string`   | **Opcional**. Telefone do usuário           |
| `password`     | `string`   | **Opcional**. Senha do usuário              |
| `location`     | `string`   | **Opcional**. Localização do usuário        |
| `profilePicture` | `string` | **Opcional**. URL da foto de perfil do usuário |

**Resposta:**

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "+5511999999999",
  "role": "User",
  "plan": "Basic",
  "profilePicture": "assets/ProfilePictureDefault/profile.png",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Deletar um Usuário

```http
DELETE /user/deleteUser/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`   | **Obrigatório**. O ID do usuário que você quer deletar |

**Resposta:**

```json
{
  "message": "User deleted successfully"
}
```

#### Deletar Próprio Usuário

```http
DELETE /user/deleteSelf
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key`   | `string`   | **Obrigatório**. A chave da sua API |

**Resposta:**

```json
{
  "message": "User deleted successfully"
}
```

### Endpoints de Autenticação

#### Login de Usuário

```http
POST /auth/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username`  | `string`   | **Obrigatório**. Nome de usuário do usuário |
| `password`  | `string`   | **Obrigatório**. Senha do usuário |

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Registro de Usuário

```http
POST /auth/register
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`     | `string`   | **Obrigatório**. Email do usuário           |
| `password`  | `string`   | **Obrigatório**. Senha do usuário           |
| `name`      | `string`   | **Obrigatório**. Nome do usuário            |
| `phone`     | `string`   | **Opcional**. Telefone do usuário           |
| `location`  | `string`   | **Opcional**. Localização do usuário        |
| `profilePicture` | `string` | **Opcional**. URL da foto de perfil do usuário |

**Resposta:**

```json
{
  "id": 2,
  "name": "Maria Silva",
  "email": "maria.silva@example.com",
  "phone": "+5511988888888",
  "role": "User",
  "plan": "Basic",
  "profilePicture": "assets/ProfilePictureDefault/profile.png",
  "createdAt": "2023-01-02T00:00:00.000Z"
}
```

#### Solicitação de Redefinição de Senha via Email

```http
POST /auth/requestPassByEmail
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`     | `string`   | **Obrigatório**. Email para redefinição de senha |

**Resposta:**

```json
{
  "success": true,
  "message": "Password reset request sent successfully"
}
```

#### Verificação do Código de Redefinição de Senha

```http
POST /auth/verify-code
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`     | `string`   | **Obrigatório**. Email do usuário           |
| `code`      | `string`   | **Obrigatório**. Código de verificação      |

**Resposta:**

```json
{
  "success": true,
  "message": "Código verificado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Atualização da Senha

```http
PATCH /auth/updatePass
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`     | `string`   | **Obrigatório**. Token de autenticação      |
| `newPass`   | `string`   | **Obrigatório**. Nova senha                 |

**Resposta:**

```json
{
  "success": true,
  "message": "Senha atualizada com sucesso."
}
```

#### Logout

```http
POST /auth/logout
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `api_key`   | `string`   | **Obrigatório**. A chave da sua API         |

**Resposta:**

```json
{
  "message": "Logged out successfully"
}
```

### Endpoints de Chat

#### Criar um Chat

```http
POST /api/chat
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `prompt`    | `string`   | **Obrigatório**. Prompt inicial do chat     |
| `userId`    | `number`   | **Obrigatório**. ID do usuário              |

**Resposta:**

```json
{
  "id": 1,
  "userId": 1,
  "name": "Chat name",
  "menssageHistory": "User: Hello AI: Hi there!",
  "newAnswer": "AI: Hi there!",
  "chatStart": "2023-01-01T00:00:00.000Z",
  "chatEnd": "2023-01-01T00:00:00.000Z"
}
```

#### Atualizar um Chat

```http
PATCH /api/chat/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`   | **Obrigatório**. ID do chat                 |
| `newPrompt` | `string`   | **Obrigatório**. Novo prompt para o chat    |

**Resposta:**

```json
{
  "id": 1,
  "userId": 1,
  "name": "Chat name",
  "menssageHistory": "User: Hello AI: Hi there!\nUser: How are you? AI: I'm fine, thank you!",
  "newAnswer": "AI: I'm fine, thank you!",
  "chatStart": "2023-01-01T00:00:00.000Z",
  "chatEnd": "2023-01-01T00:00:00.000Z"
}
```

#### Obter Todos os Chats

```http
GET /api/chats
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key`   | `string`   | **Obrigatório**. A chave da sua API |

**Resposta:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Chat name 1",
    "menssageHistory": "User: Hello AI: Hi there!",
    "newAnswer": "AI: Hi there!",
    "chatStart": "2023-01-01T00:00:00.000Z",
    "chatEnd": "2023-01-01T00:00:00.000Z"
  },
  ...
]
```

#### Obter um Chat pelo ID

```http
GET /api/chat/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`   | **Obrigatório**. O ID do chat que você quer |

**Resposta:**

```json
{
  "id": 1,
  "userId": 1,
  "name": "Chat name",
  "menssageHistory": "User: Hello AI: Hi there!",
  "newAnswer": "AI: Hi there!",
  "chatStart": "2023-01-01T00:00:00.000Z",
  "chatEnd": "2023-01-01T00:00:00.000Z"
}
```

#### Deletar um Chat

```http
DELETE /api/chat/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`   | **Obrigatório**. O ID do chat que você quer deletar |

**Resposta:**

```json
{
  "message": "Chat deleted successfully"
}
```

#### Renomear um Chat

```http
PATCH /api/chat/:id/rename
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`   | **Obrigatório**. O ID do chat               |
| `newName`   | `string`   | **Obrigatório**. O novo nome do chat        |

**Resposta:**

```json
{
  "id": 1,
  "userId": 1,
  "name": "New Chat Name",
  "menssageHistory": "User: Hello AI: Hi there!",
  "newAnswer": "AI: Hi there!",
  "chatStart": "2023-01-01T00:00:00.000Z",
  "chatEnd": "2023-01-01T00:00:00.000Z"
}
```

### Endpoints do Stripe

#### Criar um Cliente no Stripe

```http
POST /stripe/create-customer
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`     | `string`   | **Obrigatório**. Email do cliente           |
| `name`      | `string`   | **Obrigatório**. Nome do cliente            |
| `userId`    | `number`   | **Obrigatório**. ID do usuário              |

**Resposta:**

```json
{
  "id": "cus_J1a2b3c4d5e6f7g8h9",
  "object": "customer",
  "email": "email@example.com",
  "name": "John Doe"
}
```

#### Criar uma Sessão de Checkout no Stripe

```http
POST /stripe/create-checkout-session
```

| Parâmetro       | Tipo       | Descrição                                   |
| :-------------- | :--------- | :------------------------------------------ |
| `customerId`    | `string`   | **Obrigatório**. ID do cliente no Stripe    |
| `priceId`       | `string`   | **Obrigatório**. ID do preço do produto/serviço |
| `paymentMethodTypes` | `string[]` | **Obrigatório**. Métodos de pagamento aceitos |

**Resposta:**

```json
{
  "id": "cs_test_a1b2c3d4e5f6g7h8i9",
  "object": "checkout.session",
  "payment_method_types": ["card"],
  "customer": "cus_J1a2b3c4d5e6f7g8h9",
  "line_items": [
    {
      "price": "price_1Hh1JK2eZvKYlo2Cx8N8l1w8",
      "quantity": 1
    }
  ],
  "mode": "subscription",
  "success_url": "http://localhost:3000/success",
  "cancel_url": "http://localhost:3000/cancel"
}
```

#### Manipular Webhook do Stripe

```http
POST /stripe/webhook
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `signature` | `string`   | **Obrigatório**. Assinatura do Webhook do Stripe |

**Resposta:**

```json
{
  "message": "Webhook handled successfully"
}
```

---

### Essa documentação cobre todos os endpoints principais da API, sendo eles: Autenticação, Usuário, ChatGPT e Integração com o Stripe.


## Contribuição

Contribuições são bem-vindas! 🙌 Por favor, siga as [diretrizes de contribuição](CONTRIBUTING.md).

## Licença

Este projeto está licenciado sob a Licença MIT. 📜 Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Se você tiver alguma dúvida ou precisar de mais assistência, sinta-se à vontade para entrar em contato pelo e-mail [luizbelispetre@gmail.com]. 📧

---

Feliz codificação! Esperamos que este boilerplate ajude você a iniciar sua startup com facilidade e eficiência. 🚀
