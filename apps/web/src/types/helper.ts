import { type MergeDeep } from "type-fest";
import { type Database as DatabaseGenerated } from "./generated";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        integrated_subsidies_view: {
          Row: {
            id: string; // Assuming UUID is represented as a string in TypeScript
            created_at: Date;
            trim_id: string; // UUID
            national_subsidy: number;
            local_subsidy: number;
            year: number;
            region_code: string;
            wheel_id: string | null; // UUID, can be null for general subsidies
            subsidy_type: "wheel_specific" | "general";
          };
        };
      };
    };
  }
>;

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];
