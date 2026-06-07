export type CartProduct = {
  category: any;
  id: number;
  name: string;
  image_url: string;
  price: number;
};

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;

  start_date: string;
  end_date: string;

  duration: number;
  price: number;
  subtotal: number;

  product: CartProduct;
};

export type Cart = {
  id: number;
  user_id: number;
  cart_items: CartItem[];
};