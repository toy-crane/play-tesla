"use client";

import { Trim } from "@/types/data";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Card = ({
  trim,
  order,
  option,
}: {
  trim: Trim;
  order: "primary" | "secondary";
  option: {
    seat: string;
    wheel: string;
    color: string;
    interior: string;
    steering: string;
  };
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  const imageUrl = `https://static-assets.tesla.com/configurator/compositor?options=${trim.code},${option.color},${option.wheel},${option.interior}&&view=FRONT34&model=${trim.models?.code}`;

  return (
    <div className="flex flex-1 flex-col">
      <Link href={imageUrl}>
        {trim?.models?.name} {trim?.name}
      </Link>
      <div>
        <div>좌석</div>
        <RadioGroup value={option.seat}>
          {trim?.seatings?.map((seating) => (
            <div
              className="flex items-center space-x-2"
              key={seating.seat_count}
            >
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
        <RadioGroup value={option.wheel}>
          {trim?.wheels?.map((wheel) => (
            <div className="flex items-center space-x-2" key={wheel.code}>
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
        <RadioGroup value={option.color}>
          {trim?.models?.colors?.map((color) => (
            <div className="flex items-center space-x-2" key={color.code}>
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
        <RadioGroup value={option.interior}>
          {trim?.models?.interiors?.map((interior) => (
            <div className="flex items-center space-x-2" key={interior.code}>
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
        <RadioGroup value={option.steering}>
          {trim?.models?.steerings?.map((steering) => (
            <div className="flex items-center space-x-2" key={steering.code}>
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
