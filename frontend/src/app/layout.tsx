import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TranslationProvider } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinTech - Kişisel Finans Takip',
  description: 'Bütçenizi, gelir ve giderlerinizi kolayca takip edin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
