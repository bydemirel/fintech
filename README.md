# FinTech - Kişisel Finans Takip Uygulaması

Bu proje, kullanıcıların gelir ve giderlerini takip edebilecekleri, modern ve kullanıcı dostu bir web uygulamasıdır.

## Özellikler

- Gelir ve gider işlemleri ekleme
- Kategori bazlı harcama takibi
- Aylık gelir/gider analizi
- Filtreleme ve sıralama özellikleri
- Modern ve kullanıcı dostu arayüz
- Gerçek zamanlı veritabanı bağlantısı

## Teknolojiler

### Frontend
- Next.js 13 (App Router)
- React 18
- Tailwind CSS
- TypeScript
- Recharts (Grafikler için)

### Backend
- Node.js
- Express.js
- SQLite (Veritabanı)

## Kurulum

### Ön Koşullar
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici/fintech.git
cd fintech
```

2. Backend kurulumu:
```bash
cd backend
npm install
npm run dev
```

3. Frontend kurulumu:
```bash
cd frontend
npm install
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

## Veritabanı Şeması

### Categories Tablosu
- id: INTEGER (Primary Key)
- name: TEXT
- type: TEXT ('income' veya 'expense')
- color: TEXT

### Transactions Tablosu
- id: INTEGER (Primary Key)
- description: TEXT
- amount: REAL
- type: TEXT ('income' veya 'expense')
- categoryId: INTEGER (Foreign Key)
- date: TEXT
- createdAt: TEXT

## API Endpoints

| Endpoint                  | Metod  | Açıklama                         |
|---------------------------|--------|----------------------------------|
| /api/transactions         | GET    | Tüm işlemleri getir              |
| /api/transactions         | POST   | Yeni işlem ekle                  |
| /api/transactions/:id     | PUT    | İşlem güncelle                   |
| /api/transactions/:id     | DELETE | İşlem sil                        |
| /api/categories           | GET    | Tüm kategorileri getir           |
| /api/balance              | GET    | Bakiye bilgilerini getir         |
| /api/stats/monthly        | GET    | Aylık istatistikleri getir       |
| /api/stats/categories     | GET    | Kategori bazlı harcamaları getir |

## Ekran Görüntüleri

![Dashboard](screenshots/dashboard.png)
![İşlem Ekleme](screenshots/add_transaction.png)

## Lisans

MIT 