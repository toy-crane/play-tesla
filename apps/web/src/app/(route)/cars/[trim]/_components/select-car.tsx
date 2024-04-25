"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface Trim {
  models: { name: string } | null;
  slug: string;
  name: string | null;
}

export function SelectCar({ trims, slug }: { trims: Trim[]; slug: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const carLabels = trims.map((trim) => ({
    value: `${trim.slug}`,
    label: `${trim.models?.name} ${trim.name}`,
  }));

  const handleSelectedCar = (value: string) => {
    const region = searchParams.get("region") ?? "1100";
    router.replace(`/cars/${value}?region=${region}`);
  };

  const selectedCarLabel = carLabels.find((car) => car.value === slug);

  if (isDesktop) {
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between overflow-hidden bg-white"
            role="combobox"
            variant="ghost"
          >
            <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
              {selectedCarLabel ? (
                <>{selectedCarLabel.label}</>
              ) : (
                <>차종을 선택해 주세요.</>
              )}
            </h2>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[360px] p-0">
          <CarsSelection
            carLabels={carLabels}
            onSelectedCar={handleSelectedCar}
            setOpen={setOpen}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between bg-white overflow-hidden"
          role="combobox"
          variant="ghost"
        >
          <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
            {selectedCarLabel ? (
              <>{selectedCarLabel.label}</>
            ) : (
              <>차종을 선택해 주세요.</>
            )}
          </h2>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CarsSelection
            carLabels={carLabels}
            onSelectedCar={handleSelectedCar}
            setOpen={setOpen}
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
              onSelect={(value) => {
                if (value) {
                  onSelectedCar(value);
                }
                setOpen(false);
              }}
              value={label.value}
            >
              {label.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
