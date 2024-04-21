"use client";

import { Trim } from "@/types/data";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

const Card = ({
  trim,
  order,
}: {
  trim: Trim;
  order: "primary" | "secondary";
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  const currentSeatOption =
    searchParams.get(`${order}Seat`) || String(trim.seatings[0]?.seat_count);
  const currentWheelOption =
    searchParams.get(`${order}Wheel`) || trim.wheels[0]?.code;
  const currentColorOption =
    searchParams.get(`${order}Color`) || trim?.models?.colors[0]?.code;
  const currentInteriorOption =
    searchParams.get(`${order}Interior`) || trim?.models?.interiors[0]?.code;
  const currentSteeringOption =
    searchParams.get(`${order}Steering`) || trim?.models?.steerings[0]?.code;

  const imageUrl = `https://static-assets.tesla.com/configurator/compositor?options=${trim.code},${currentColorOption},${currentWheelOption},${currentInteriorOption}&&view=FRONT34&model=${trim.models?.code}`;

  return (
    <div className="flex flex-1 flex-col">
      <Link href={imageUrl}>
        {trim?.models?.name} {trim?.name}
      </Link>
      <div>
        <div>좌석</div>
        <RadioGroup defaultValue={currentSeatOption}>
          {trim?.seatings?.map((seating) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={seating.seat_count.toString()}
                id={`s${seating.seat_count}`}
                onClick={() => {
                  handleParamsChange(
                    `${order}Seating`,
                    String(seating.seat_count)
                  );
                }}
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
        <RadioGroup defaultValue={currentWheelOption}>
          {trim?.wheels?.map((wheel) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={wheel.code}
                id={`w${wheel.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Wheel`, wheel.code);
                }}
              />
              <Label htmlFor={`w${wheel.code}`}>{wheel.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>색상</h1>
        <RadioGroup defaultValue={currentColorOption}>
          {trim?.models?.colors?.map((color) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={color.code}
                id={`c${color.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Color`, color.code);
                }}
              />
              <Label htmlFor={`c${color.code}`}>{color.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>인테리어</h1>
        <RadioGroup defaultValue={currentInteriorOption}>
          {trim?.models?.interiors?.map((interior) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={interior.code}
                id={`i${interior.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Interior`, interior.code);
                }}
              />
              <Label htmlFor={`i${interior.code}`}>{interior.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h1>스티어링</h1>
        <RadioGroup defaultValue={currentSteeringOption}>
          {trim?.models?.steerings?.map((steering) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={steering.code}
                id={`st${steering.code}`}
                onClick={() => {
                  handleParamsChange(`${order}Steering`, steering.code);
                }}
              />
              <Label htmlFor={`st${steering.code}`}>{steering.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Card;
