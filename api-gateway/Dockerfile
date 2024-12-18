# Node.js temel imajını kullan
FROM node:20

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Uygulama kodlarını kopyala
COPY . .

# API Gateway'i başlat
EXPOSE 3000
CMD ["node", "app.js"]
