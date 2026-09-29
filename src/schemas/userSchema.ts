import { z } from 'zod';
import { number } from 'zod/v4';

export const userRegistrationSchema = z.object({
    firstName: z
    .string({required_error: "Name is requared"})
    .min(2, {message: "Name must be more then 2 symbols"}),

    email: z
    .string({required_error: "Email is requared"})
    .email({message: 'Invalid email'}),

    // age: z
    // .string()
    // .transform((val) => Number(val))
    // .refine((val) => !isNaN(val), {message: "Age must be number"})
    // .refine((val) => val >= 18 && val >= 100, {message:"Age must be bigger then 18 and less then 100"}),

    age: z.coerce
    .number({
      required_error: "Age is requared",
      invalid_type_error: "Age must be number"
    })
    .min(18, {message: "Age must be bigger then 18"})
    .max(100, {message: "Age must be less then 100"}),

    password: z
    .string()
    .min(6, {message: "Password must be more then 6 symbols"})
    .regex(/[A-Z]/, {message: "Password must have big letters"})
    .regex(/[0-9]/, {message: "Password must have digit"}),

    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords are different",
        path: ["confirmPassword"],
    });

export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
