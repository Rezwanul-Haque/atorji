export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  size: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  gender: 'male' | 'female' | 'unisex';
  rating: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
