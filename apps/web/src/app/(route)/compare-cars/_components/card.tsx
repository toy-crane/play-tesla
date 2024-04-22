"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Trim } from "@/types/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CarView } from "@/constants/image";

// 모든 트림에 대한 인테리어 코드를 가져오지 않음
const defaultInterior = {
  mx: "$IBC00",
  m3: "$IPB3",
} as const;

const getImageUrl = (trim: Trim, option: Option, view: CarView) => {
  const interiorCode =
    defaultInterior[trim.models?.code as keyof typeof defaultInterior];
  return `https://dgfgljvxbegytbhujxbk.supabase.co/storage/v1/object/public/cars/${trim.models?.code}/${trim.code}/${option.color}-${option.wheel}-${interiorCode}-${view}`;
};

interface Option {
  seat: string;
  wheel: string;
  color: string;
  interior: string;
  steering: string;
}

function Card({
  trim,
  order,
  option,
}: {
  trim: Trim;
  order: "primary" | "secondary";
  option: Option;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  const imageUrl = getImageUrl(trim, option, CarView.FRONT);

  return (
    <div className="flex flex-1 flex-col">
      <Image
        alt={`${trim.models?.name} ${trim.name}`}
        height={400}
        src={imageUrl}
        width={400}
      />
      <div>
        <div>좌석</div>
        <RadioGroup value={option.seat}>
          {trim.seatings.map((seating) => (
            <div
              className="flex items-center space-x-2"
              key={seating.seat_count}
            >
              <RadioGroupItem
                id={`s${seating.seat_count}`}
                onClick={() => {
                  handleParamsChange(
                    `${order}Seating`,
                    String(seating.seat_count)
                  );
                }}
                value={seating.seat_count.toString()}
              />
              <Label htmlFor={`s${seating.seat_count}`}>
                {seating.seat_count}인승
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>휠</h1>
        <RadioGroup value={option.wheel}>
          {trim.wheels.map((wheel) => (
            <div className="flex items-center space-x-2" key={wheel.code}>
              <RadioGroupItem
                id={`w${wheel.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Wheel`, wheel.code);
                }}
                value={wheel.code}
              />
              <Label htmlFor={`w${wheel.code}`}>{wheel.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>색상</h1>
        <RadioGroup value={option.color}>
          {trim.models?.colors.map((color) => (
            <div className="flex items-center space-x-2" key={color.code}>
              <RadioGroupItem
                id={`c${color.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Color`, color.code);
                }}
                value={color.code}
              />
              <Label htmlFor={`c${color.code}`}>{color.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>인테리어</h1>
        <RadioGroup value={option.interior}>
          {trim.models?.interiors.map((interior) => (
            <div className="flex items-center space-x-2" key={interior.code}>
              <RadioGroupItem
                id={`i${interior.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Interior`, interior.code);
                }}
                value={interior.code}
              />
              <Label htmlFor={`i${interior.code}`}>{interior.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>스티어링</h1>
        <RadioGroup value={option.steering}>
          {trim.models?.steerings.map((steering) => (
            <div className="flex items-center space-x-2" key={steering.code}>
              <RadioGroupItem
                id={`st${steering.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Steering`, steering.code);
                }}
                value={steering.code}
              />
              <Label htmlFor={`st${steering.code}`}>{steering.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default Card;
