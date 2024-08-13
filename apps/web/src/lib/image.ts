import type { CarView } from "@/constants/image";

// 모든 트림에 대한 인테리어 코드를 가져오지 않음
const defaultInterior = {
  $MTX19: "$IBC00",
  $MTX18: "$IBC00",
  $MTS18: "$IBE00",
  $MTS19: "$IBE00",
  $MTY31: "$INPB0",
  $MTY30: "$INPB0",
  $MTY17: "$INPB0",
  $MT351: "$IPB3",
  $MT352: "$IPB3",
  $MT353: "$IPB4",
} as const;

const getDefaultInteriorCode = (trimCode: string) => {
  return defaultInterior[trimCode as keyof typeof defaultInterior];
};

const getCarImageUrl = (
  modelCode: string,
  trimCode: string,
  colorCode: string,
  wheelCode: string,
  view: CarView
) => {
  const interiorCode = getDefaultInteriorCode(trimCode);
  return `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co/storage/v1/object/public/cars/${modelCode}/${trimCode}/${colorCode}-${wheelCode}-${interiorCode}-${view}`;
};

export { getCarImageUrl };
