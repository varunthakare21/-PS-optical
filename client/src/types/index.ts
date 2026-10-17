export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'worker' | 'admin';
  emailVerified: boolean;
  accountStatus: string;
  storeId?: string;
  avatar?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: Category;
  brand: Brand;
  images: string[];
  frameShape: string;
  frameMaterial: string;
  frameColor: string[];
  frameSize: string;
  gender: string;
  lensWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
  weight?: number;
  basePrice: number;
  salePrice?: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  supportedLensTypes: string[];
  prescriptionCompatible: boolean;
  averageRating: number;
  reviewCount: number;
  warranty?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  isPremium: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  color: string;
  size: string;
  lensType?: string;
  lensOptions?: string[];
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  couponCode?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  color: string;
  size: string;
  lensType?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Store {
  _id: string;
  name: string;
  slug: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  phone: string;
  email?: string;
  openingHours: { day: string; open: string; close: string; closed: boolean }[];
  services: string[];
  images: string[];
  isActive: boolean;
}

export interface Appointment {
  _id: string;
  store: Store | string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
}

export interface Prescription {
  _id: string;
  doctorName?: string;
  prescriptionDate?: string;
  expiryDate?: string;
  rightEye: EyeData;
  leftEye: EyeData;
  pupillaryDistance?: number;
  pdRight?: number;
  pdLeft?: number;
  notes?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface EyeData {
  sphere?: number;
  cylinder?: number;
  axis?: number;
  addition?: number;
}

export interface Review {
  _id: string;
  customer: { name: string; avatar?: string };
  rating: number;
  title?: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}
