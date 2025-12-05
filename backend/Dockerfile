# Usar uma versão LTS e estável do Node
FROM node:18

# Definir diretório de trabalho
WORKDIR /app

# Copiar somente package.json e package-lock.json primeiro (melhor cache)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do backend
COPY . .

# Expor a porta que o Railway usa automaticamente
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "start"]

