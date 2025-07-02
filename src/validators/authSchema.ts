import z from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "이메일은 필수 입력 항목입니다." })
    .trim()
    .email("유효한 이메일 형식이 아닙니다."),
  password: z
    .string({ required_error: "비밀번호는 필수 입력 항목입니다." })
    .trim()
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
    .max(20, "비밀번호는 최대 20자 이하여야 합니다.")
    .regex(/[A-Z]/,"비밀번호는 최소 하나의 대문자가 포함되어야 합니다.")
    .regex(/[^A-Za-z0-9]/,"비밀번호는 최소 하나의 특수문자가 포함되어야 합니다."),
  username: z
    .string({ required_error: "이름은 필수 입력 항목입니다." })
    .trim()
    .min(2, "이름은 최소 2자리 이상이어야 합니다.")
    .max(10, "이름은 최대 10자리 이하여야 합니다."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("유효한 이메일 형식이 아닙니다."),
  password: z.string().trim().min(8, "비밀번호는 최소 8자리 이상이어야 합니다."),
});
