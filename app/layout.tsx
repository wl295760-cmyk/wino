import type { Metadata } from 'next';
import { Nanum_Myeongjo, Noto_Serif_KR } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '위노뷰티 WITH NOA — 청주 속눈썹 연장/펌',
    template: '%s · 위노뷰티',
  },
  description: '정직함으로, 실력으로. 청주 위노뷰티에서 당신의 아름다움을 함께합니다.',
  metadataBase: new URL('https://winobeauty.kr'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '위노뷰티',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${nanumMyeongjo.variable} ${notoSerifKr.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
