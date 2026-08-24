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

export type CargoStatus = 'Sipariş Alındı' | 'Hazırlanıyor' | 'Kargoya Verildi' | 'Teslim Edildi';

export type Order = {
  id: string;
  date: string;
  total: string;
  items: OrderItem[];
  status?: CargoStatus;
  trackingNumber?: string;
  cargoCompany?: string;
  deliveryDate?: string;
};

export type AuthUser = {
  email: string;
  firstName?: string;
  lastName?: string;
  orders: Order[];
  favorites: FavoriteItem[];
  isAdmin?: boolean;
  address?: string;
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
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  if (!isClient) return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

const getCurrentUserEmail = (): string | null => {
  if (!isClient) return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
};

const saveCurrentUserEmail = (email: string | null) => {
  if (!isClient) return;
  if (email === null) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    window.localStorage.setItem(CURRENT_USER_KEY, email);
  }
};

const hashPassword = async (password: string): Promise<string> => {
  return password;
};

const createDefaultOrders = (): Order[] => [
  {
    id: 'ORD-7492',
    date: '20.08.2026',
    total: '19.498 TL',
    status: 'Teslim Edildi',
    trackingNumber: 'MLW839201948TR',
    cargoCompany: 'Yurtiçi Kargo',
    deliveryDate: '22.08.2026',
    items: [
      { productId: 'M18-FPD', name: 'M18 FPD™ Akülü Matkap', price: '14.999 TL', quantity: 1 },
      { productId: 'M18-SET', name: 'M18™ Akü Seti 5 Ah', price: '4.499 TL', quantity: 1 },
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

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthUser> => {
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
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    orders: createDefaultOrders(),
    favorites: createDefaultFavorites(),
    isAdmin: normalized === ADMIN_EMAIL,
  };

  saveStoredUsers([...users, newUser]);
  saveCurrentUserEmail(normalized);

  return {
    email: normalized,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
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
      firstName: 'Sistem',
      lastName: 'Yöneticisi',
      orders: createDefaultOrders(),
      favorites: createDefaultFavorites(),
      isAdmin: true,
    };
    saveStoredUsers([...getStoredUsers(), adminUser]);
    saveCurrentUserEmail(normalized);
    return {
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
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
    firstName: user.firstName,
    lastName: user.lastName,
    orders: user.orders,
    favorites: user.favorites,
    isAdmin: user.isAdmin,
    address: user.address,
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
    firstName: user.firstName,
    lastName: user.lastName,
    orders: user.orders,
    favorites: user.favorites,
    address: user.address,
    isAdmin: user.isAdmin,
  };
};

export const updateUserAddress = (address: string): void => {
  if (!isClient) return;
  const email = getCurrentUserEmail();
  if (!email) return;

  const users = getStoredUsers();
  const nextUsers = users.map((u) => u.email === email ? { ...u, address } : u);
  saveStoredUsers(nextUsers);
};

export const addOrderToCurrentUser = (total: string, items: OrderItem[]): void => {
  if (!isClient) return;
  const email = getCurrentUserEmail();
  if (!email) return;

  const users = getStoredUsers();
  const nextUsers = users.map((u) => {
    if (u.email === email) {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('tr-TR'),
        total,
        items,
        status: 'Kargoya Verildi',
        trackingNumber: `MLW${Math.floor(100000000 + Math.random() * 900000000)}TR`,
        cargoCompany: 'Yurtiçi Kargo',
      };
      return {
        ...u,
        orders: [newOrder, ...u.orders],
      };
    }
    return u;
  });
  saveStoredUsers(nextUsers);
};
