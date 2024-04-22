"use client";

import * as React from "react";
import { useMediaQuery } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tables } from "@/types/generated";

type Trim = Tables<"trims"> & {
  models: Tables<"models"> | null;
};

export function SelectCar({
  trims,
  order,
}: {
  trims: Trim[];
  order: "primary" | "secondary";
}) {
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const carLabels = trims.map((trim) => ({
    value: `${trim.slug}`,
    label: `${trim.models?.name} ${trim.name}`,
  }));

  const handleSelectedCar = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(`${order}Trim`, value);
    router.replace(`?${params.toString()}`);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between overflow-hidden bg-white"
          >
            <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
              차종을 선택해 주세요.
            </h2>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start">
          <CarsSelection
            setOpen={setOpen}
            onSelectedCar={handleSelectedCar}
            carLabels={carLabels}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white overflow-hidden"
        >
          <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
            차종을 선택해 주세요.
          </h2>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CarsSelection
            setOpen={setOpen}
            onSelectedCar={handleSelectedCar}
            carLabels={carLabels}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function CarsSelection({
  setOpen,
  carLabels,
  onSelectedCar,
}: {
  setOpen: (open: boolean) => void;
  carLabels: { value: string; label: string }[];
  onSelectedCar: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="모델을 선택해 주세요." />
      <CommandList>
        <CommandEmpty>결과가 없습니다.</CommandEmpty>
        <CommandGroup>
          {carLabels.map((label) => (
            <CommandItem
              key={label.value}
              value={label.value}
              onSelect={(value) => {
                console.log(value);
                if (value) {
                  onSelectedCar(value);
                }
                setOpen(false);
              }}
            >
              {label.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
