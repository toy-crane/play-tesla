"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const MODELS = [
  {
    label: "모델 X",
    value: "modelx",
  },
  {
    label: "모델 S",
    value: "models",
  },
  {
    label: "모델 Y",
    value: "modely",
  },
  {
    label: "모델 3",
    value: "model3",
  },
] as const;

function SelectModel({
  modelSlug,
  className,
}: {
  modelSlug: string;
  className?: string;
}) {
  const router = useRouter();

  const currentModel = MODELS.find((m) => m.value === modelSlug);
  if (currentModel === undefined) return;

  return (
    <div className={cn("space-y-2 flex", className)}>
      <RadioGroup
        className="flex gap-x-4 flex-wrap gap-y-2"
        value={currentModel.value}
      >
        {MODELS.map((model) => (
          <div key={model.value}>
            <RadioGroupItem
              className="peer sr-only"
              id={model.value}
              onClick={() => {
                router.replace(`/prices/${model.value}`);
              }}
              value={model.value}
            />
            <Label
              className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-2"
              htmlFor={model.value}
            >
              <div className="flex flex-col">{model.label}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default SelectModel;
