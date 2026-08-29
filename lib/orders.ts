import type { Order, OrderItem, CargoStatus } from './auth';

const ORDERS_KEY = 'milwaukee_all_orders';

export const getGlobalOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(ORDERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const saveGlobalOrder = (order: Order) => {
  const currentOrders = getGlobalOrders();
  const newOrders = [order, ...currentOrders];
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
  }
};

export const findOrderByCode = (code: string): Order | undefined => {
  const orders = getGlobalOrders();
  return orders.find((o) => o.id.toLowerCase() === code.toLowerCase());
};
