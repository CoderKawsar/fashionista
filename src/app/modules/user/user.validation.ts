import { z } from "zod";

const RegisterUserZodSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: "Nick name is required!" }).trim(),
    mobile_number: z
      .string({ required_error: "Contact number is required!" })
      .trim(),
    email: z.string({ required_error: "Email is required!" }).trim(),
    password: z.string({ required_error: "Password is required!" }).min(8),
  }),
});

const CreateAdminOrTeacherZodSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: "Nick name is required!" }).trim(),
    mobile_number: z
      .string({ required_error: "Contact number is required!" })
      .trim(),
    email: z.string({ required_error: "Email is required!" }).trim(),
    password: z.string({ required_error: "Password is required!" }).min(8),
  }),
});

const UpdateUserZodSchema = z.object({
  body: z
    .object({
      full_name: z.string().trim().optional(),
      email: z.string().email().trim().optional(),
      mobile_number: z.string().trim().optional(),
    })
    .strict(),
});

const UpdateUserAndUserDetailsZodSchema = z.object({
  body: z
    .object({
      full_name: z.string().trim().optional(),
      email: z.string().trim().email().optional(),
    })
    .strict(),
});

const LoginUserZodSchema = z.object({
  body: z.object({
    email_or_mobile: z
      .string({
        required_error: "Email or contact number is required to login",
      })
      .trim(),
    password: z.string({
      required_error: "Password is required!",
    }),
  }),
});

const RefreshTokenZodSchema = z.object({
  cookies: z.object({
    refresh_token: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const VerifyIsEmailExistingZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .trim(),
  }),
});

const ForgotPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .trim(),
    otp: z
      .string({
        required_error: "OTP is required!",
      })
      .trim(),
    password: z
      .string({
        required_error: "Password is required!",
      })
      .min(8),
  }),
});

const ChangePasswordZodSchema = z.object({
  body: z.object({
    mobile_number: z
      .string({
        required_error: "Contact number is required!",
      })
      .trim(),
    old_password: z.string({
      required_error: "Old password is required!",
    }),
    new_password: z
      .string({
        required_error: "New password is required!",
      })
      .min(8),
  }),
});

export const UserValidation = {
  RegisterUserZodSchema,
  CreateAdminOrTeacherZodSchema,
  UpdateUserZodSchema,
  UpdateUserAndUserDetailsZodSchema,
  LoginUserZodSchema,
  RefreshTokenZodSchema,
  VerifyIsEmailExistingZodSchema,
  ForgotPasswordZodSchema,
  ChangePasswordZodSchema,
};
