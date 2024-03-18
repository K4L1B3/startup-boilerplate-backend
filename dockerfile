# Defina a imagem base
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o arquivo package.json e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Construa o projeto, se necessário
RUN npm run build

# Exponha a porta em que sua aplicação estará escutando
EXPOSE 3000

# Comando para executar a aplicação
CMD ["npm", "run", "start:prod"]
