export interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
  icon?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle?: string;
  headlineTitle?: string;
  category: 'Hot Coffee' | 'Cold Brew' | 'Tea' | 'Bakery';
  price: number;
  description: string;
  image: string;
  isFavorite?: boolean;
  sizes?: { name: string; priceDelta: number }[];
  milks?: ProductOption[];
  temperatures?: string[];
  sweetnessLevels?: string[];
  customizations?: {
    size?: string;
    milk?: string;
    temperature?: string;
    sweetness?: string;
    warmed?: boolean;
    extraHot?: boolean;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  basePrice: number;
  size: string;
  milk?: string;
  temperature?: string;
  sweetness?: string;
  warmed?: boolean;
  extraHot?: boolean;
  notes?: string;
  quantity: number;
  image: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  estimatedMinutes: number;
  hours: string;
}

export interface PaymentMethod {
  id: string;
  type: 'apple_pay' | 'card' | 'google_pay';
  label: string;
  detail?: string;
  expiry?: string;
  icon: string;
}

export interface FestivalPromotion {
  id: string;
  name: string;
  themeTitle: string;
  tagline: string;
  promoCode: string;
  discountPercent: number;
  icon: string;
  badge: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  featuredDrinkIds: string[];
  bannerImage: string;
  expiryNote: string;
  isActive: boolean;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  promoCode?: string;
  tax: number;
  total: number;
  orderType: 'Pickup' | 'Delivery';
  location: PickupLocation;
  paymentMethod: PaymentMethod;
  status: 'Received' | 'Brewing' | 'Ready for Pickup' | 'Completed';
  createdAt: string;
  estimatedPickupTime: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: string;
  icon: string;
  claimed: boolean;
}
