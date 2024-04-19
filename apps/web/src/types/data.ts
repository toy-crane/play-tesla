export type Trim = {
  code: string;
  created_at: string;
  id: string;
  model_id: string;
  name: string | null;
  models: {
    name: string;
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
};
