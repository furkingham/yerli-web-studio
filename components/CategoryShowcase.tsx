import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  {
    title: 'M18 SERİSİ',
    subtitle: 'Profesyonel akülü güç',
    description: 'Zorlu uygulamalar için yüksek performans.',
    href: '/category?category=M18%20Serisi',
    image: '/collection-m18.png',
    className: 'md:col-span-2',
  },
  {
    title: 'M12 SERİSİ',
    subtitle: 'Kompakt ve güçlü',
    description: 'Dar alanlarda hassas kontrol.',
    href: '/category?category=M12%20Serisi',
    image: '/collection-m12.png',
    className: '',
  },
  {
    title: 'EL ALETLERİ',
    subtitle: 'Günlük profesyonel çözümler',
    description: 'Dayanıklı aksesuar ve el aletleri.',
    href: '/category?category=El%20Aletleri',
    image: '/collection-hand-tools.png',
    className: '',
  },
  {
    title: 'İŞ GÜVENLİĞİ',
    subtitle: 'Sahada güvenli çalışma',
    description: 'Koruyucu ekipman ve profesyonel donanım.',
    href: '/category?category=%C4%B0%C5%9F%20G%C3%BCvenli%C4%9Fi',
    image: '/collection-safety.png',
    className: 'md:col-span-2',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-milwaukee">Koleksiyonları keşfet</span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">İşiniz için doğru sistem</h2>
        </div>
        <Link href="/category" className="hidden items-center gap-1 text-xs font-bold uppercase tracking-wider text-milwaukee transition hover:text-slate-900 sm:flex">
          Tüm kategoriler <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {collections.map((collection) => (
          <Link key={collection.title} href={collection.href} className={`group relative min-h-[230px] overflow-hidden rounded-2xl bg-slate-900 ${collection.className}`}>
            <Image src={collection.image} alt={collection.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">{collection.subtitle}</span>
              <h3 className="mt-1 text-xl font-black">{collection.title}</h3>
              <p className="mt-1 max-w-xs text-xs text-white/75">{collection.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white transition group-hover:text-red-200">Keşfet <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
