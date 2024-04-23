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
}

export interface Option {
  seat: string;
  wheel: string;
  color: string;
  interior: string;
  steering: string;
}
