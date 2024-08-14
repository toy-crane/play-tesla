"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option, Trim } from "@/types/data";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DrivingOptionKeys = "ap" | "eap" | "fsd";
const DrivingOptionOrder: { [key in DrivingOptionKeys]: number } = {
  ap: 1,
  eap: 2,
  fsd: 3,
};

function OptionForm({
  trim,
  currentOption,
}: {
  currentOption: Option;
  trim: Trim;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const orderedColors = trim.models?.colors.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const orderedDrivingAssist = trim.models?.driving_assist_options.sort(
    (a, b) => {
      return (
        DrivingOptionOrder[a.code as DrivingOptionKeys] -
        DrivingOptionOrder[b.code as DrivingOptionKeys]
      );
    }
  );

  const handleColorToggle = useCallback(
    (colorCode: string) => {
      handleParamsChange(`color`, colorCode);
    },
    [handleParamsChange]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">색상</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={currentOption.color}
        >
          {orderedColors?.map((color) => (
            <div key={color.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`c${color.code}`}
                onClick={() => {
                  handleColorToggle(color.code);
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
                  <span className="text-muted-foreground text-xs font-light">
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
          value={currentOption.wheel}
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
                <div className="flex flex-col gap-1">
                  <span>{wheel.name} </span>
                  <span className="text-muted-foreground text-xs font-light">
                    {wheel.price > 0
                      ? `+${wheel.price.toLocaleString()}원`
                      : `추가 금액 없음`}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">인테리어</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={currentOption.interior}
        >
          {trim.interiors.map((interior) => (
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
                <div className="flex flex-col gap-1">
                  <span>{interior.korean_name} </span>
                  <span className="text-muted-foreground text-xs font-light">
                    {interior.price > 0
                      ? `+${interior.price.toLocaleString()}원`
                      : `추가 금액 없음`}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">좌석</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={currentOption.seat}
        >
          {trim.seatings.map((seating) => (
            <div key={seating.seat_count}>
              <RadioGroupItem
                className="peer sr-only"
                id={`s${seating.seat_count.toString()}`}
                onClick={() => {
                  handleParamsChange(`seat`, String(seating.seat_count));
                }}
                value={seating.seat_count.toString()}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`s${seating.seat_count.toString()}`}
              >
                {trim.seatings.length === 1 ? (
                  `${seating.seat_count.toString()} 인승`
                ) : (
                  <div className="flex flex-col gap-1">
                    <span>{seating.seat_count} 인승 </span>
                    <span className="text-muted-foreground text-xs font-light">
                      {seating.price > 0
                        ? `+${seating.price.toLocaleString()}원`
                        : `추가 금액 없음`}
                    </span>
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">스티어링</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={currentOption.steering}
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
                {trim.models?.steerings.length === 1 ? (
                  steering.name
                ) : (
                  <div className="flex flex-col gap-1">
                    <span>{steering.name} </span>
                    <span className="text-muted-foreground text-xs font-light">
                      {steering.price > 0
                        ? `+${steering.price.toLocaleString()}원`
                        : `추가 금액 없음`}
                    </span>
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">주행 보조</h2>
        <RadioGroup
          className="flex gap-x-4 flex-wrap gap-y-2"
          value={currentOption.drivingAssist}
        >
          {orderedDrivingAssist?.map((option) => (
            <div key={option.code}>
              <RadioGroupItem
                className="peer sr-only"
                id={`st${option.code}`}
                onClick={() => {
                  handleParamsChange(`drivingAssist`, option.code);
                }}
                value={option.code}
              />
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
                htmlFor={`st${option.code}`}
              >
                <div className="flex flex-col gap-1">
                  <span>{option.korean_name} </span>
                  <span className="text-muted-foreground text-xs font-light">
                    {option.price > 0
                      ? `+${option.price.toLocaleString()}원`
                      : `추가 금액 없음`}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default OptionForm;
