import { Button } from "@/components/ui/button";

export default function Page(): JSX.Element {
  return (
    <main>
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="font-medium">Hello</div>
        <div className="font-semibold">Hello</div>
        <div className="font-bold">Hello</div>
        <div className="font-extrabold">Hello</div>
        <Button size="sm">Hello</Button>
        <Button>Hello</Button>
        <Button size="lg">Hello</Button>
      </div>
    </main>
  );
}
