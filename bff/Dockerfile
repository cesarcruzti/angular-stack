# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie os arquivos de definição de dependências
COPY package*.json ./

# Instale as dependências do projeto
# Use 'npm ci' para instalações mais rápidas e confiáveis em ambientes de CI/CD
RUN npm ci

# Copie o restante do código-fonte da aplicação
COPY . .

# Compile o código TypeScript para JavaScript
RUN npm run build

# Exponha a porta em que a aplicação será executada
EXPOSE 3000

# Defina o comando para iniciar a aplicação em produção
CMD [ "node", "dist/index.js" ]
