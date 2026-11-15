# 🎮 LetterStation — Front-end

Interface web do **LetterStation**, uma plataforma inspirada no Letterboxd, voltada para jogos. O sistema permite explorar jogos, publicar resenhas, visualizar avaliações e interagir com outros usuários.

## 📋 Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- Firebase Authentication
- API própria desenvolvida com FastAPI

## ⚙️ Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão v26.13.0).
- npm (instalado junto com o Node.js, versão 11.20.0).
- Git.

## 📁 Estrutura do projeto

O código do front-end está localizado dentro da pasta `letterstation`:

```text
LetterStation_Frontend/
└── letterstation/
    ├── package.json
    ├── src/
    └── ...
```

## 📥 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/EduardoMerSim/LetterStation_Frontend.git
```

2. Acesse a pasta do repositório:

```bash
cd LetterStation_Frontend
```

3. Entre na pasta do front-end:

```bash
cd letterstation
```

4. Instale as dependências:

```bash
npm install
```

## 🔐 Configuração do ambiente

O front-end precisa conhecer o endereço da API do LetterStation para realizar as requisições ao back-end.

Dentro da pasta `letterstation`, no mesmo nível do `package.json`, crie um arquivo chamado `.env.local` e configure:

```env
VITE_API_URL=http://localhost:8000
```

**Importante:** o endereço acima é utilizado quando o front-end e o back-end estão sendo executados na mesma máquina, ou seja, o endereço deve corresponder ao endereço local da api.

Não compartilhe arquivos de configuração que contenham chaves ou informações privadas.

## ▶️ Executando o projeto

Após instalar as dependências e configurar o ambiente, certifique-se de estar dentro da pasta `letterstation` e execute:

```bash
npm run dev
```

O Vite disponibilizará o endereço local do front-end, normalmente:

http://localhost:5173

Acesse esse endereço pelo navegador para utilizar o sistema.

**Atenção:** o back-end precisa estar em execução para que as funcionalidades que dependem da API funcionem corretamente.

## 💻 Funcionalidades do sistema

O LetterStation disponibiliza as seguintes funcionalidades:

- **Cadastro:** criação de uma conta utilizando e-mail, senha e username.
- **Login:** autenticação de usuários.
- **Perfil:** visualização e atualização das informações pessoais.
- **Pesquisa de jogos:** busca e exploração do catálogo de jogos.
- **Resenhas:** criação, visualização, edição e exclusão de publicações sobre jogos.
- **Feed:** visualização das resenhas publicadas pelos usuários.
- **Perfis públicos:** acesso aos perfis de outros integrantes da plataforma.
- **Seguidores:** possibilidade de seguir e deixar de seguir outros usuários.

## 🔗 Integração com o back-end

O front-end realiza as requisições à API própria do LetterStation, responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.

O endereço padrão do back-end é, normalmente:

http://localhost:8000

A documentação interativa dos endpoints pode ser acessada em:

http://localhost:8000/docs

## ⚠️ Solução de problemas

**O site não inicia:**
- Verifique se o Node.js está instalado.
- Confira se as dependências foram instaladas com `npm install`.
- Verifique se está executando os comandos dentro da pasta `letterstation`.

**O site abre, mas não carrega os dados:**
- Verifique se o back-end está em execução.
- Confira o endereço configurado em `.env.local`.
- Verifique se o back-end está permitindo a origem utilizada pelo front-end por meio do CORS.

**Erro de autenticação:**
- Verifique a configuração do Firebase.
- Confira se as credenciais e configurações necessárias estão corretas.

## 👥 Projeto acadêmico

LetterStation é um projeto acadêmico desenvolvido como parte das atividades do curso de Ciência da Computação, para o 4º semestre, na disciplina de Aplicações Digitais.

O projeto tem como objetivo desenvolver uma aplicação integrada, utilizando tecnologias de desenvolvimento web, API própria, autenticação e banco de dados relacional.