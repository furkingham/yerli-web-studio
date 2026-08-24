export type ProductReview = {
  id: string;
  productId: string;
  productName: string;
  userEmail: string;
  userName: string;
  date: string;
  overallRating: number; // 1 to 5
  durabilityRating: number; // Dayanıklılık (1 to 5)
  materialRating: number; // Materyal Kalitesi (1 to 5)
  performanceRating: number; // Performans / Güç (1 to 5)
  comment: string;
  verifiedPurchase: boolean;
};

const REVIEWS_STORAGE_KEY = 'milwaukee_product_reviews';

const isClient = typeof window !== 'undefined';

const defaultReviews: ProductReview[] = [
  {
    id: 'REV-101',
    productId: 'M18-FPD',
    productName: 'M18 FPD™ Akülü Matkap',
    userEmail: 'ahmet.kaya@example.com',
    userName: 'Ahmet Kaya (Usta İnşaat)',
    date: '21.08.2026',
    overallRating: 5,
    durabilityRating: 5,
    materialRating: 5,
    performanceRating: 5,
    comment: 'Şantiyede en ağır beton delme işlerinde kullandık. Tork gücü ve batarya optimizasyonu muazzam. Kesinlikle tavsiye ederim.',
    verifiedPurchase: true,
  },
  {
    id: 'REV-102',
    productId: 'M18-FPD',
    productName: 'M18 FPD™ Akülü Matkap',
    userEmail: 'mehmet.yilmaz@example.com',
    userName: 'Mehmet Yılmaz',
    date: '18.08.2026',
    overallRating: 5,
    durabilityRating: 5,
    materialRating: 5,
    performanceRating: 5,
    comment: 'Kömürsüz motor farkını hissettiriyor. Gövde materyal kalitesi çok sağlam, düşmelere karşı son derece dirençli.',
    verifiedPurchase: true,
  },
  {
    id: 'REV-103',
    productId: 'M12-FPD',
    productName: 'M12 FPD™ Kompakt Vidalama',
    userEmail: 'serkan.demir@example.com',
    userName: 'Serkan Demir',
    date: '15.08.2026',
    overallRating: 5,
    durabilityRating: 5,
    materialRating: 4,
    performanceRating: 5,
    comment: 'Kompakt boyutuna göre inanılmaz bir tork üretiyor. Dar alanlardaki montajlarda kurtarıcımız oldu.',
    verifiedPurchase: true,
  },
  {
    id: 'REV-104',
    productId: 'M18-CAG',
    productName: 'M18™ Akülü Testere',
    userEmail: 'volkan.t@example.com',
    userName: 'Volkan Tekin',
    date: '12.08.2026',
    overallRating: 5,
    durabilityRating: 5,
    materialRating: 5,
    performanceRating: 5,
    comment: 'Ağır çelik ve ahşap kesimlerinde motor bayılma yapmıyor. Milwaukee kalitesi her detayda kendini gösteriyor.',
    verifiedPurchase: true,
  },
];

export const getStoredReviews = (): ProductReview[] => {
  if (!isClient) return defaultReviews;
  const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews));
    return defaultReviews;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultReviews;
  } catch {
    return defaultReviews;
  }
};

export const addProductReview = (
  newReview: Omit<ProductReview, 'id' | 'date'>
): ProductReview => {
  const reviews = getStoredReviews();
  const reviewToAdd: ProductReview = {
    ...newReview,
    id: `REV-${Date.now()}`,
    date: new Date().toLocaleDateString('tr-TR'),
  };

  const updatedReviews = [reviewToAdd, ...reviews];
  if (isClient) {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updatedReviews));
  }
  return reviewToAdd;
};

export const getProductReviews = (productIdOrSlug: string): ProductReview[] => {
  const reviews = getStoredReviews();
  return reviews.filter(
    (r) =>
      r.productId.toLowerCase() === productIdOrSlug.toLowerCase() ||
      r.productName.toLowerCase().includes(productIdOrSlug.toLowerCase())
  );
};

export type RatingSummary = {
  averageRating: number;
  durabilityAvg: number;
  materialAvg: number;
  performanceAvg: number;
  totalReviews: number;
};

export const getProductRatingSummary = (productIdOrSlug: string): RatingSummary => {
  const reviews = getProductReviews(productIdOrSlug);
  if (reviews.length === 0) {
    return {
      averageRating: 5.0,
      durabilityAvg: 5.0,
      materialAvg: 5.0,
      performanceAvg: 5.0,
      totalReviews: 0,
    };
  }

  const sumOverall = reviews.reduce((acc, r) => acc + r.overallRating, 0);
  const sumDurability = reviews.reduce((acc, r) => acc + r.durabilityRating, 0);
  const sumMaterial = reviews.reduce((acc, r) => acc + r.materialRating, 0);
  const sumPerformance = reviews.reduce((acc, r) => acc + r.performanceRating, 0);
  const count = reviews.length;

  return {
    averageRating: Number((sumOverall / count).toFixed(1)),
    durabilityAvg: Number((sumDurability / count).toFixed(1)),
    materialAvg: Number((sumMaterial / count).toFixed(1)),
    performanceAvg: Number((sumPerformance / count).toFixed(1)),
    totalReviews: count,
  };
};
