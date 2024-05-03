"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  isAgree: z.boolean().default(false).optional(),
  email: z.string().email("이메일 형식이 아닙니다."),
});

function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isAgree: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 md:px-6">
        <div className="space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            테슬라 가격 변동 알림 받기
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            테슬라 차량의 가격 변동을 이메일 알림으로 가장 빠르게 받아보세요.
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full max-w-sm space-x-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormControl>
                      <Input
                        className="flex-auto"
                        placeholder="이메일 입력하기"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">알림 받기</Button>
            </div>
            <FormField
              control={form.control}
              name="isAgree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormLabel
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="agreement"
                        >
                          <Button
                            className="underline px-0 py-0 h-fit hover:bg-white"
                            type="button"
                            variant="ghost"
                          >
                            개인 정보 수집 약관
                          </Button>
                          에 동의합니다.
                        </FormLabel>
                      </PopoverTrigger>
                      <PopoverContent className="text-xs">
                        play-tesla는 가격 알림을 발송을 위해 이메일 주소를
                        수집하고자 합니다. 수집된 이메일은 가격 알림 이외의
                        목적으로 사용되지 않으며, 서비스 종료 혹은 회원님의 요청
                        시 즉시 삭제됩니다.
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </section>
  );
}

export default Page;
