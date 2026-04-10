export type ProductCategory = "fitness" | "kids" | "senior" | "peanut";

export type NutritionFacts = {
  servingSize: string;
  calories: number;
  protein: string;
  carbs: string;
  fiber: string;
  fat: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  price: number;
  rating: number;
  image: string;
  ingredients: string[];
  stock: number;
  nutritionFacts: NutritionFacts;
  benefits: string[];
  preparation: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus = "pending" | "processing" | "packed" | "shipped" | "delivered";

export type PaymentMethod = "razorpay" | "upi" | "card" | "netbanking" | "cod" | "bank_transfer";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed";

export type PaymentInfo = {
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: "razorpay" | "manual";
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type OrderLine = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payment: PaymentInfo;
  customer: OrderCustomer;
  items: OrderLine[];
  subtotal: number;
};


