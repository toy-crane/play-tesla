export interface Trim {
  code: string;
  created_at: string;
  id: string;
  model_id: string;
  name: string | null;
  models: {
    name: string;
    code: string;
    colors: {
      code: string;
      created_at: string;
      id: string;
      model_id: string;
      name: string;
      price: number;
    }[];
    interiors: {
      name: string;
      code: string;
      price: number;
    }[];
    steerings: {
      name: string;
      price: number;
      code: string;
    }[];
  } | null;
  seatings: {
    seat_count: number;
    price: number;
  }[];
  wheels: {
    name: string;
    code: string;
    price: number;
  }[];
}
