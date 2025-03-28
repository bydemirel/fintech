# FinTrack Backend

Node.js ve Express.js ile geliştirilmiş REST API.

## Teknolojiler

- Node.js + Express
- TypeScript
- TypeORM (PostgreSQL)
- routing-controllers
- TypeDI (Dependency Injection)
- JWT authentication
- Repository Pattern

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=fintrack
JWT_SECRET=supersecretkey
```

3. Development modunda çalıştırın:
```bash
npm run dev
```

4. Derleme:
```bash
npm run build
```

5. Production modunda çalıştırma:
```bash
npm start
```

## API Endpoints

### Kullanıcılar

- `POST /users/register` - Yeni kullanıcı kaydı
- `POST /users/login` - Kullanıcı girişi
- `GET /users/profile` - Profil bilgilerini getir
- `PUT /users/profile` - Profil bilgilerini güncelle
- `PUT /users/change-password` - Şifre değiştir

### İşlemler (Transactions)

- `GET /transactions` - Tüm işlemleri getir (filtreler: startDate, endDate, type)
- `POST /transactions` - Yeni işlem ekle
- `PUT /transactions/:id` - İşlemi güncelle
- `DELETE /transactions/:id` - İşlemi sil

### Kategoriler

- `GET /categories` - Tüm kategorileri getir (filtre: type)
- `POST /categories` - Yeni kategori ekle
- `PUT /categories/:id` - Kategoriyi güncelle
- `DELETE /categories/:id` - Kategoriyi sil 