import { z } from "zod";

const FormSchema = z.object({
  isAgree: z.boolean().default(false).optional(),
  email: z.string().email("이메일 형식이 아닙니다."),
});

export { FormSchema };
