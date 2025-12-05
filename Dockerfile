# Usa uma imagem estável de Node
FROM node:18

# Cria o diretório da aplicação
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Exponha a porta que o Railway vai usar
EXPOSE 4000

# Comando padrão de inicialização
CMD ["npm", "start"]
