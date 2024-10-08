"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useQueryState } from "nuqs";
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
import regions from "@/constants/regions";

export function SelectRegion({ code }: { code: string }) {
  const [open, setOpen] = React.useState(false);
  const [currentRegion, setCurrentRegion] = useQueryState("region", {
    defaultValue: code,
    shallow: false,
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const regionLabels = regions.map((region) => ({
    value: region.province ? `${region.province} ${region.name}` : region.name,
    label: region.province ? `${region.province} ${region.name}` : region.name,
    regionCode: region.code,
  }));

  const handleSelectedRegion = (regionCode: string) => {
    void setCurrentRegion(regionCode);
  };

  const selectedRegionLabel = regionLabels.find(
    (car) => car.regionCode === currentRegion
  );

  if (isDesktop) {
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between overflow-hidden bg-white px-2 text-lg"
            role="combobox"
            size="lg"
            variant="ghost"
          >
            <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
              {selectedRegionLabel ? (
                <>{selectedRegionLabel.label}</>
              ) : (
                <>지역을 선택해 주세요.</>
              )}
            </h2>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[360px] p-0">
          <RegionsSelection
            onSelectedRegion={handleSelectedRegion}
            regionLabels={regionLabels}
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
          className="w-full justify-between bg-white overflow-hidden px-2 text-lg"
          role="combobox"
          size="lg"
          variant="ghost"
        >
          <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">
            {selectedRegionLabel ? (
              <>{selectedRegionLabel.label}</>
            ) : (
              <>지역을 선택해 주세요.</>
            )}
          </h2>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <RegionsSelection
            onSelectedRegion={handleSelectedRegion}
            regionLabels={regionLabels}
            setOpen={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function RegionsSelection({
  setOpen,
  regionLabels,
  onSelectedRegion: onSelectedCar,
}: {
  setOpen: (open: boolean) => void;
  regionLabels: { value: string; label: string; regionCode: string }[];
  onSelectedRegion: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="지역을 선택해 주세요." />
      <CommandList>
        <CommandEmpty>결과가 없습니다.</CommandEmpty>
        <CommandGroup>
          {regionLabels.map((label) => (
            <CommandItem
              key={label.value}
              onSelect={(value) => {
                if (value) {
                  onSelectedCar(label.regionCode);
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
