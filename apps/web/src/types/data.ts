import type { Tables } from "./generated";

export interface Trim extends Omit<Tables<"trims">, "created_at" | "id"> {
  models:
    | (Omit<Tables<"models">, "created_at" | "id"> & {
        colors: Tables<"colors">[];
        interiors: Tables<"interiors">[];
        steerings: Tables<"steerings">[];
      })
    | null;
  seatings: Tables<"seatings">[];
  wheels: Tables<"wheels">[];
  trim_prices?: Tables<"trim_prices">[] | null;
  subsidies?: Tables<"subsidies">[] | null;
}

export interface Option {
  seat: string;
  wheel: string;
  color: string;
  interior: string;
  steering: string;
}
