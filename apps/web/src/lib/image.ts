import type { CarView } from "@/constants/image";
import type { Trim, Option } from "@/types/data";

// 모든 트림에 대한 인테리어 코드를 가져오지 않음
const defaultInterior = {
  modelx: "$IBC00",
  model3: "$IPB3",
  modely: "$INPB0",
  models: "$IBE00",
} as const;

const getDefaultInteriorCode = (slug: string) => {
  const [model, trim] = slug.split("-");
  if (model === "model3" && trim === "performance") {
    return "$IPB4";
  }
  return defaultInterior[model as keyof typeof defaultInterior];
};

const getCarImageUrl = (trim: Trim, option: Option, view: CarView) => {
  const interiorCode = getDefaultInteriorCode(trim.slug);
  return `https://dgfgljvxbegytbhujxbk.supabase.co/storage/v1/object/public/cars/${trim.models?.code}/${trim.code}/${option.color}-${option.wheel}-${interiorCode}-${view}`;
};

export { getCarImageUrl };
