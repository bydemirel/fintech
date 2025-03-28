# FinTrack Frontend

Next.js ile geliştirilmiş kişisel finans takip uygulaması.

## Teknolojiler

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- i18next (Çoklu dil desteği)
- Axios
- Recharts (Grafikler için)

## Özellikler

- Gelir ve gider takibi
- Kategorilere göre filtreleme
- Tarih aralığına göre filtreleme
- Grafiklerle analiz
- Türkçe/İngilizce dil desteği
- Duyarlı tasarım (Responsive design)

## Kurulum

### Gereksinimler

- Node.js 18+

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Development modunda çalıştırın:
```bash
npm run dev
```

3. Derleme:
```bash
npm run build
```

4. Production modunda çalıştırma:
```bash
npm start
```

## Sayfa Yapısı

- `/` - Ana sayfa (Dashboard)
- `/auth/login` - Giriş
- `/auth/register` - Kayıt
- `/transactions` - Tüm işlemler
- `/transactions/new` - Yeni işlem
- `/categories` - Kategoriler
- `/profile` - Kullanıcı profili

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
