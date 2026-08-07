export type FavoriteItem = {
  productId: string;
  name: string;
  price: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: string;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  total: string;
  items: OrderItem[];
};

export type AuthUser = {
  email: string;
  orders: Order[];
  favorites: FavoriteItem[];
  isAdmin?: boolean;
};

type StoredUser = AuthUser & {
  passwordHash: string;
};

const USER_STORAGE_KEY = 'milwaukee_users';
const CURRENT_USER_KEY = 'milwaukee_current_user';

const isClient = typeof window !== 'undefined';

const getStoredUsers = (): StoredUser[] => {
  if (!isClient) return [];
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
  if (!isClient) return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

const saveCurrentUserEmail = (email: string | null) => {
  if (!isClient) return;
  if (email) {
    window.localStorage.setItem(CURRENT_USER_KEY, email);
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const getCurrentUserEmail = (): string | null => {
  if (!isClient) return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
};

export const hashPassword = async (password: string): Promise<string> => {
  if (!isClient) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const createDefaultOrders = (): Order[] => [
  {
    id: 'ORD-1001',
    date: '01/06/2026',
    total: '24.599 TL',
    items: [
      { productId: 'M18-FPD', name: 'M18 FPD™ Akülü Matkap', price: '14.999 TL', quantity: 1 },
      { productId: 'M18-PACK', name: 'M18™ Akü Seti 5 Ah', price: '4.499 TL', quantity: 1 },
    ],
  },
];

const createDefaultFavorites = (): FavoriteItem[] => [
  { productId: 'M18-CAG', name: 'M18™ Akülü Testere', price: '16.299 TL' },
  { productId: 'M12-TORQ', name: 'M12™ Akülü Tork Anahtarı', price: '7.999 TL' },
];

const ADMIN_EMAIL = 'admin@milwaukee.com';

const getUserRecord = (email: string): StoredUser | undefined => {
  return getStoredUsers().find((user) => user.email === email.toLowerCase());
};

const getNormalizedEmail = (email: string) => email.trim().toLowerCase();

export const registerUser = async (email: string, password: string): Promise<AuthUser> => {
  if (!isClient) throw new Error('Kayıt sadece tarayıcıda desteklenir.');

  const normalized = getNormalizedEmail(email);
  const users = getStoredUsers();

  if (users.some((user) => user.email === normalized)) {
    throw new Error('Bu e-posta zaten kayıtlı.');
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    email: normalized,
    passwordHash,
    orders: createDefaultOrders(),
    favorites: createDefaultFavorites(),
    isAdmin: normalized === ADMIN_EMAIL,
  };

  saveStoredUsers([...users, newUser]);
  saveCurrentUserEmail(normalized);

  return {
    email: normalized,
    orders: newUser.orders,
    favorites: newUser.favorites,
    isAdmin: newUser.isAdmin,
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  if (!isClient) throw new Error('Giriş sadece tarayıcıda desteklenir.');

  const normalized = getNormalizedEmail(email);
  let user = getUserRecord(normalized);

  if (!user && normalized === ADMIN_EMAIL) {
    const passwordHash = await hashPassword(password);
    const adminUser: StoredUser = {
      email: normalized,
      passwordHash,
      orders: createDefaultOrders(),
      favorites: createDefaultFavorites(),
      isAdmin: true,
    };
    saveStoredUsers([...getStoredUsers(), adminUser]);
    saveCurrentUserEmail(normalized);
    return {
      email: adminUser.email,
      orders: adminUser.orders,
      favorites: adminUser.favorites,
      isAdmin: true,
    };
  }

  if (!user) {
    throw new Error('E-posta veya şifre hatalı.');
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error('E-posta veya şifre hatalı.');
  }

  saveCurrentUserEmail(normalized);

  return {
    email: user.email,
    orders: user.orders,
    favorites: user.favorites,
    isAdmin: user.isAdmin,
  };
};

export const logoutUser = (): void => {
  saveCurrentUserEmail(null);
};

export const getCurrentUser = (): AuthUser | null => {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const user = getUserRecord(email);
  if (!user) return null;

  return {
    email: user.email,
    orders: user.orders,
    favorites: user.favorites,
  };
};
