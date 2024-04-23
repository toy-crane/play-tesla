import type { CarView } from "@/constants/image";
import type { Trim, Option } from "@/types/data";

// 모든 트림에 대한 인테리어 코드를 가져오지 않음
const defaultInterior = {
  mx: "$IBC00",
  m3: "$IPB3",
  my: "$INPB0",
} as const;

const getCarImageUrl = (trim: Trim, option: Option, view: CarView) => {
  const interiorCode =
    defaultInterior[trim.models?.code as keyof typeof defaultInterior];
  return `https://dgfgljvxbegytbhujxbk.supabase.co/storage/v1/object/public/cars/${trim.models?.code}/${trim.code}/${option.color}-${option.wheel}-${interiorCode}-${view}`;
};

export { getCarImageUrl };
