// Các kiểu dữ liệu dùng chung (client-side)
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  priceMin: number;
  priceMax: number;
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note: string | null;
  total: number;
  shipFee: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  user?: { name: string; email: string };
}

export interface Category {
  name: string;
  count: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
}

export interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  byStatus: Record<string, number>;
  last7Days: { label: string; revenue: number; orders: number }[];
  byCategory: { category: string; revenue: number }[];
  avgOrderValue: number;
}
