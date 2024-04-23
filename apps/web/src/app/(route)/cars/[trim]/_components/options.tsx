"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option, Trim } from "@/types/data";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function OptionForm({
  defaultOption,
  trim,
}: {
  defaultOption: Option;
  trim: Trim;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">색상</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={defaultOption.color}
        >
          {trim.models?.colors.map((color) => (
            <div key={color.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`c${color.code}`}
                onClick={() => {
                  handleParamsChange(`color`, color.code);
                }}
                value={color.code}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`c${color.code}`}
              >
                <div
                  className={cn(`w-5 h-5 rounded-full`)}
                  style={{ backgroundColor: color.color_code }}
                />
                <div className="flex flex-col gap-1">
                  <span>{color.korean_name} </span>
                  <span className="text-muted-foreground text-xs">
                    {color.price > 0
                      ? `+${color.price.toLocaleString()}원`
                      : `추가 금액 없음`}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">휠</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={defaultOption.wheel}
        >
          {trim.wheels.map((wheel) => (
            <div key={wheel.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`w${wheel.code}`}
                onClick={() => {
                  handleParamsChange(`wheel`, wheel.code);
                }}
                value={wheel.code}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`w${wheel.code}`}
              >
                {wheel.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">인테리어</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={defaultOption.interior}
        >
          {trim.models?.interiors.map((interior) => (
            <div key={interior.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`i${interior.code}`}
                onClick={() => {
                  handleParamsChange(`interior`, interior.code);
                }}
                value={interior.code}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`i${interior.code}`}
              >
                <div
                  className={cn(`w-5 h-5 rounded-full`)}
                  style={{ backgroundColor: interior.color_code }}
                />
                {interior.korean_name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">좌석</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={defaultOption.seat}
        >
          {trim.seatings.map((seating) => (
            <div key={seating.seat_count}>
              <RadioGroupItem
                className="peer sr-only"
                id={`s${seating.seat_count}`}
                onClick={() => {
                  handleParamsChange(`seat`, String(seating.seat_count));
                }}
                value={seating.seat_count.toString()}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`s${seating.seat_count}`}
              >
                {seating.seat_count} 인승
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">스티어링</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={defaultOption.steering}
        >
          {trim.models?.steerings.map((steering) => (
            <div key={steering.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`st${steering.code}`}
                onClick={() => {
                  handleParamsChange(`steering`, steering.code);
                }}
                value={steering.code}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`st${steering.code}`}
              >
                {steering.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default OptionForm;
