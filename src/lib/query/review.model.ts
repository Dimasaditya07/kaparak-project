export interface Review {
  id: number;
  reservation_id: number;
  user_id: number;

  review: string;

  created_at: string;
  updated_at: string;

  user?: {
    id: number;
    name: string;
    email: string;
  };
}