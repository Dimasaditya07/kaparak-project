export interface ProductItem {
  id: number;


  category_id: number;

  category?: {
    id: number;
    name: string;
    slug: string;
  };

  name: string;
  slug: string;
  code: string;
  description: string;
  stock: number;
  price: number;
  image: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}


export interface ProductResponse {
  current_page: number;
  data: ProductItem[];
  total: number;
  per_page: number;
  last_page: number;
}

export interface ProductPayload {
  name: string;
  code: string;
  stock: number;
  price: number;
  image?: File | null;
}