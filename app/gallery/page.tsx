import type { Metadata } from 'next';
import galleryData from '@/data/gallery.json';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: '갤러리',
  description: '위노뷰티 시술 결과 갤러리.',
};

const TONES: Record<number, string> = {
  1: 'hsl(28, 30%, 88%)',
  2: 'hsl(30, 26%, 82%)',
  3: 'hsl(32, 22%, 76%)',
  4: 'hsl(26, 28%, 84%)',
  5: 'hsl(34, 20%, 80%)',
};

export default function GalleryPage() {
  const items = galleryData.items;

  return (
    <div className="container-page py-12 md:py-20">
      <header className="text-center mb-10">
        <div className="text-sm tracking-caption text-ink-secondary">WITH NOA ✦ ✦ ✦</div>
        <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-brand text-ink-primary">
          갤러리
        </h1>
        <div className="mx-auto my-6 h-px w-28 bg-ink-primary" />
        <p className="text-sm text-ink-secondary">실제 시술 사진은 추후 업로드 예정입니다.</p>
      </header>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {['전체', '연장', '펌', '전/후 비교'].map((label) => (
          <button
            key={label}
            type="button"
            className="px-4 py-2 text-sm border border-border-soft rounded-full text-ink-primary hover:bg-bg-warm transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="aspect-square rounded-card-inner overflow-hidden relative group cursor-pointer"
            style={{ backgroundColor: TONES[item.tone as number] ?? '#e8dcd1' }}
          >
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-ink-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-bg-surface drop-shadow">{item.alt}</span>
            </div>
            <span className="sr-only">{item.alt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
