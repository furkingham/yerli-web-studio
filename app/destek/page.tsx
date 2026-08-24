'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Package, ShoppingBag, RotateCcw, Truck, User, Search, Home, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  q: string;
  a: string;
}

interface SupportTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  faqs: FAQ[];
}

const supportTopics: SupportTopic[] = [
  {
    id: 'urunler',
    title: 'Ürünler',
    description: 'Garanti, teknik özellikler ve ürün kullanımı hakkında sorular.',
    icon: Package,
    faqs: [
      {
        q: 'Milwaukee aletlerinin garanti süresi nedir?',
        a: 'Tüm Milwaukee elektrikli el aletleri ve aküleri standart 2 yıl garanti kapsamındadır. Ürününüzü satın aldıktan sonraki 30 gün içinde resmi internet sitesi üzerinden kaydettirerek bu garanti süresini ücretsiz olarak 3 yıla uzatabilirsiniz.'
      },
      {
        q: 'Kömürsüz (Brushless) motor ile kömürlü motor arasındaki fark nedir?',
        a: 'Kömürsüz motorlar fiziksel karbon kömürleri içermediği için sürtünmeyi sıfıra indirir. Bu sayede motor daha az ısınır, pil ömrü %50\'ye kadar artar, güç çıkışı optimize edilir ve kömür değişimi gibi periyodik motor bakımlarına ihtiyaç duyulmaz.'
      },
      {
        q: 'M12 ve M18 aküler birbirleriyle uyumlu mudur?',
        a: 'M12 aküler yalnızca M12 serisi kompakt aletlerle, M18 aküler ise yalnızca M18 serisi yüksek performanslı aletlerle uyumludur. Akü voltaj grupları şarj cihazları hariç (bazı şarj cihazları çift soketlidir) birbirinin yerine kullanılamaz.'
      }
    ]
  },
  {
    id: 'siparisler',
    title: 'Siparişler',
    description: 'Sipariş takibi, fatura detayları ve ödeme yöntemleri.',
    icon: ShoppingBag,
    faqs: [
      {
        q: 'Siparişimi nasıl takip edebilirim?',
        a: 'Siparişiniz kargoya teslim edildiğinde size gönderilen SMS ve e-postadaki kargo takip numarası ile veya web sitemizdeki "Hesabım" sekmesinde yer alan "Siparişlerim" bölümünden durumunu canlı olarak sorgulayabilirsiniz.'
      },
      {
        q: 'Kurumsal siparişlerde e-fatura düzenleniyor mu?',
        a: 'Evet, sipariş adımlarını tamamlarken fatura adresi kısmından "Kurumsal Fatura" seçeneğini işaretleyip Vergi Numarası, Vergi Dairesi ve Firma Unvanı bilgilerinizi girerek adınıza e-fatura veya e-arşiv fatura düzenlenmesini sağlayabilirsiniz.'
      },
      {
        q: 'Siparişimi kargoya verilmeden önce iptal edebilirim?',
        a: 'Kargoya teslim edilmemiş siparişlerinizi iptal etmek için müşteri destek hattımızla veya destek@milwaukeepro.store adresi üzerinden bizimle iletişime geçebilirsiniz. İptal işlemi onaylandığında ücret iadeniz otomatik olarak başlatılır.'
      }
    ]
  },
  {
    id: 'iade',
    title: 'İade',
    description: 'İade politikası, kargo kodları ve geri ödeme koşulları.',
    icon: RotateCcw,
    faqs: [
      {
        q: 'İade süresi kaç gündür?',
        a: 'Satın aldığınız ürünleri, teslim aldığınız tarihten itibaren 14 gün yasal cayma hakkı kapsamında herhangi bir gerekçe göstermeksizin iade edebilirsiniz. İade edilecek ürünlerin açılmamış, kullanılmamış ve satılabilirlik özelliğini kaybetmemiş olması gerekmektedir.'
      },
      {
        q: 'Ürünü nasıl iade edebilirim?',
        a: 'Hesabım paneli üzerinden iade talebi oluşturduktan sonra size verilecek ücretsiz iade kargo koduyla birlikte ürünü orijinal kutusu, aksesuarları ve faturasıyla Yurtiçi Kargo şubelerine teslim edebilirsiniz.'
      },
      {
        q: 'İade edilen ürünün ücreti ne zaman hesabıma yansır?',
        a: 'İade ettiğiniz ürün depomuza ulaştıktan sonra teknik ekibimiz tarafından inceelenir. İade şartlarına uygunluğu onaylanan ürünlerin ücreti 3 iş günü içinde kartınıza iade edilir. İadenin ekstrenize yansıması banka prosedürlerine bağlı olarak 1-7 iş günü sürebilir.'
      }
    ]
  },
  {
    id: 'kargo-teslimat',
    title: 'Kargo ve Teslimat',
    description: 'Gönderim süreleri, ücretsiz kargo limitleri ve kurye bilgileri.',
    icon: Truck,
    faqs: [
      {
        q: 'Kargo ücreti ne kadar?',
        a: 'Milwaukee Pro Store üzerinden yapacağınız 2.500 TL ve üzeri tüm alışverişlerde kargo gönderimi tamamen ücretsizdir. 2.500 TL altındaki siparişler için sepetinizde sabit standart kargo ücreti hesaplanacaktır.'
      },
      {
        q: 'Siparişim kaç günde teslim edilir?',
        a: 'Hafta içi saat 16:00\'ya kadar verilen siparişler aynı gün kargoya teslim edilmektedir. Kargo firması teslimat adresinize bağlı olarak gönderiyi genellikle 1 ila 3 iş günü içerisinde adresinize ulaştırır.'
      },
      {
        q: 'Hangi kargo firmaları ile çalışıyorsunuz?',
        a: 'Siparişlerimizin güvenli teslimatı için öncelikli olarak Yurtiçi Kargo ile çalışmaktayız. Ağır ve hacimli paletli ürün grupları ise anlaşmalı ambar lojistik firmaları ile kapınıza teslim edilir.'
      }
    ]
  },
  {
    id: 'hesabim',
    title: 'Hesabım',
    description: 'Üyelik işlemleri, şifre sıfırlama ve adres rehberi.',
    icon: User,
    faqs: [
      {
        q: 'Nasıl üye olabilirim?',
        a: 'Sayfanın sağ üstündeki giriş ikonuna tıklayıp "/auth" sayfasına giderek e-posta adresiniz ve belirleyeceğiniz şifre ile saniyeler içinde üye kaydı oluşturebilirsiniz.'
      },
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Giriş ekranında bulunan "Şifremi Unuttum" linkine tıklayarak sisteme kayıtlı e-posta adresinizi girdiğinizde, şifrenizi sıfırlamanız için size özel güvenli bir sıfırlama bağlantısı gönderilecektir.'
      },
      {
        q: 'Kayıtlı adres bilgilerimi nasıl güncellerim?',
        a: 'Üye girişi yaptıktan sonra "Hesabım" paneline girip "Adres Bilgilerim" kısmından mevcut teslimat ve fatura adreslerinizi düzenleyebilir veya yeni adresler tanımlayabilirsiniz.'
      }
    ]
  }
];

export default function DestekPage() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (question: string) => {
    setExpandedFaq(expandedFaq === question ? null : question);
  };

  // Filter topics and FAQs based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return supportTopics;
    }
    const query = searchQuery.toLowerCase();
    return supportTopics.map((topic) => {
      const filteredFaqs = topic.faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)
      );
      return {
        ...topic,
        faqs: filteredFaqs
      };
    }).filter((topic) => topic.faqs.length > 0 || topic.title.toLowerCase().includes(query));
  }, [searchQuery]);

  const activeTopicData = supportTopics.find((t) => t.id === activeTopic);

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(activeTopic === topicId ? null : topicId);
    setExpandedFaq(null);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-white transition flex items-center gap-1">
          <Home className="h-3 w-3" /> Anasayfa
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-milwaukee font-medium">Yardım & Destek</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#141414] p-8 shadow-industrial md:p-12">
        <div className="absolute right-0 top-0 h-40 w-40 bg-milwaukee/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-2xl space-y-4">
          <h1 className="text-4xl font-semibold text-white tracking-tight">Yardım Konuları</h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Siparişleriniz, iade süreçleriniz veya teknik ürün detayları hakkında merak ettikleriniz mi var? 
            Aşağıdaki yardım kategorilerinden birini seçebilir ya da arama çubuğunu kullanabilirsiniz.
          </p>
          
          {/* Live Search FAQ Bar */}
          <div className="relative mt-6 max-w-lg">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTopic(null); // Clear active filter when searching
              }}
              placeholder="Sorunuzu buraya yazın (Örn: garanti, iade kargo...)"
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-milwaukee focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Grid of Support Boxes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {supportTopics.map((topic) => {
          const Icon = topic.icon;
          const isActive = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`flex flex-col text-left p-6 rounded-[24px] border transition duration-300 relative overflow-hidden group ${
                isActive
                  ? 'border-milwaukee bg-milwaukee/10 text-white shadow-[0_10px_30px_rgba(219,0,0,0.15)]'
                  : 'border-white/10 bg-[#141414] hover:border-white/30 text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className={`p-3 rounded-2xl inline-flex w-fit transition ${
                isActive ? 'bg-milwaukee text-black' : 'bg-white/5 text-milwaukee group-hover:bg-white/10'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-semibold text-lg text-white group-hover:text-milwaukee transition">
                {topic.title}
              </h2>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {topic.description}
              </p>
              <span className="absolute bottom-4 right-4 text-slate-500 group-hover:text-white transition">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ Display Area */}
      <div className="rounded-[32px] border border-white/10 bg-[#141414] p-6 md:p-8 shadow-industrial">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-milwaukee" />
          {activeTopicData ? `${activeTopicData.title} ile İlgili Sorular` : 'Sıkça Sorulan Sorular'}
        </h2>
        
        <div className="mt-8 space-y-4">
          {/* If looking at a filtered set (search or active topic) */}
          {activeTopicData ? (
            activeTopicData.faqs.map((faq) => {
              const isExpanded = expandedFaq === faq.q;
              return (
                <div key={faq.q} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(faq.q)}
                    className="flex w-full items-center justify-between py-3 text-left text-sm md:text-base font-medium text-slate-200 hover:text-white transition"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-milwaukee shrink-0 ml-4" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-500 shrink-0 ml-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })
          ) : searchQuery.trim() ? (
            // Search Results
            filteredTopics.flatMap((topic) => topic.faqs).length > 0 ? (
              filteredTopics.flatMap((topic) =>
                topic.faqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.q;
                  return (
                    <div key={faq.q} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <button
                        onClick={() => toggleFaq(faq.q)}
                        className="flex w-full items-center justify-between py-3 text-left text-sm md:text-base font-medium text-slate-200 hover:text-white transition"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-slate-500">
                            {supportTopics.find(t => t.faqs.includes(faq))?.title}
                          </span>
                          {faq.q}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-milwaukee shrink-0 ml-4" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-500 shrink-0 ml-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed pl-1">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })
              )
            ) : (
              <div className="text-center py-10 text-slate-400">
                Aramanıza uygun soru bulunamadı. Lütfen başka anahtar kelimeler deneyin.
              </div>
            )
          ) : (
            // Default view when no filter or search (Show all categorized FAQs)
            supportTopics.map((topic) => (
              <div key={topic.id} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-milwaukee border-l-2 border-milwaukee pl-3 py-1">
                  {topic.title}
                </h3>
                <div className="space-y-2 pl-4">
                  {topic.faqs.map((faq) => {
                    const isExpanded = expandedFaq === faq.q;
                    return (
                      <div key={faq.q} className="border-b border-white/5 pb-3 last:border-0">
                        <button
                          onClick={() => toggleFaq(faq.q)}
                          className="flex w-full items-center justify-between py-2 text-left text-sm md:text-base text-slate-300 hover:text-white transition"
                        >
                          <span>{faq.q}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-milwaukee shrink-0 ml-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-4" />
                          )}
                        </button>
                        {isExpanded && (
                          <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed pl-1">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
