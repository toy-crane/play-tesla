import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Page() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-md px-4 md:px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Subscribe to our newsletter
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Get the latest updates and news delivered to your inbox.
          </p>
        </div>
        <form className="mt-8 space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              className="flex-1"
              placeholder="Enter your email"
              required
              type="email"
            />
            <Button type="submit">Subscribe</Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Page;
