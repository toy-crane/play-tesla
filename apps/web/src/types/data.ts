import type { Tables } from "./generated";

export type Subsidy = Tables<"subsidies">;

export interface Trim extends Omit<Tables<"trims">, "created_at" | "id"> {
  models:
    | (Omit<Tables<"models">, "created_at" | "id" | "slug"> & {
        colors: Tables<"colors">[];
        steerings: Tables<"steerings">[];
        driving_assist_options: Tables<"driving_assist_options">[];
      })
    | null;
  seatings: Tables<"seatings">[];
  wheels: Tables<"wheels">[];
  trim_prices?: Tables<"trim_prices">[] | null;
  interiors: Tables<"interiors">[];
}

export interface Option {
  seat: string;
  wheel: string;
  color: string;
  interior: string;
  steering: string;
  drivingAssist: string;
}
