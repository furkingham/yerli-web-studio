export type AdminRole = 'Süper Yönetici' | 'Ürün Yöneticisi' | 'Sipariş Yöneticisi' | 'Görüntüleme';

export type ManagedAdmin = {
  id: string;
  username: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
};

const KEY = 'kaswa_managed_admins';

const defaults: ManagedAdmin[] = [
  {
    id: 'admin-1',
    username: 'Alikarakoyun',
    role: 'Süper Yönetici',
    active: true,
    createdAt: '2026-09-06',
  },
  {
    id: 'admin-2',
    username: 'Furkankırbıyık',
    role: 'Süper Yönetici',
    active: true,
    createdAt: '2026-09-06',
  },
];

export const getManagedAdmins = (): ManagedAdmin[] => {
  if (typeof window === 'undefined') return defaults;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    window.localStorage.setItem(KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    const parsed = JSON.parse(raw) as ManagedAdmin[];
    return Array.isArray(parsed) ? parsed : defaults;
  } catch {
    return defaults;
  }
};

export const saveManagedAdmins = (admins: ManagedAdmin[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, JSON.stringify(admins));
  }
};
