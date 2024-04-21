"use client";

import { Button } from "@/components/ui/button";
import { Trim } from "@/types/data";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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

  return (
    <div className="flex flex-1 flex-col">
      {trim?.models?.name} {trim?.name}
      <div>
        <h1>좌석</h1>
        <div className="flex gap-2">
          {trim?.seatings?.map((seating) => (
            <Button>{seating.seat_count}</Button>
          ))}
        </div>
      </div>
      <div>
        <h1>휠</h1>
        <div className="flex gap-2">
          {trim?.wheels?.map((wheel) => <Button>{wheel.name}</Button>)}
        </div>
      </div>
      <div>
        <h1>색상</h1>
        <div className="flex gap-2 overflow-auto">
          {trim?.models?.colors?.map((color) => (
            <Button
              onClick={() => handleParamsChange(`${order}Color`, color.code)}
            >
              {color.name}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h1>인테리어</h1>
        <div className="flex gap-2 overflow-auto">
          {trim?.models?.interiors?.map((interior) => (
            <Button>{interior.name}</Button>
          ))}
        </div>
      </div>
      <div>
        <h1>스티어링</h1>
        <div className="flex gap-2 overflow-auto">
          {trim?.models?.steerings?.map((steering) => (
            <Button>{steering.name}</Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
