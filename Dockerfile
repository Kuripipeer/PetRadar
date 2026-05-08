FROM node:alpine
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]