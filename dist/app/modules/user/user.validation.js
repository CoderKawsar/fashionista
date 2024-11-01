"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const RegisterUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z.string({ required_error: "Full name is required!" }).trim(),
        mobile_number: zod_1.z
            .string({ required_error: "Mobile number is required!" })
            .trim(),
        email: zod_1.z.string({ required_error: "Email is required!" }).trim(),
        password: zod_1.z.string({ required_error: "Password is required!" }).min(8),
    }),
});
const CreateAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z.string({ required_error: "Nick name is required!" }).trim(),
        mobile_number: zod_1.z
            .string({ required_error: "Contact number is required!" })
            .trim(),
        email: zod_1.z.string({ required_error: "Email is required!" }).trim(),
        password: zod_1.z.string({ required_error: "Password is required!" }).min(8),
    }),
});
const UpdateUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        full_name: zod_1.z.string().trim().optional(),
        email: zod_1.z.string().email().trim().optional(),
        mobile_number: zod_1.z.string().trim().optional(),
    })
        .strict(),
});
const UpdateUserAndUserDetailsZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        full_name: zod_1.z.string().trim().optional(),
        email: zod_1.z.string().trim().email().optional(),
    })
        .strict(),
});
const LoginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email_or_mobile: zod_1.z
            .string({
            required_error: "Email or contact number is required to login",
        })
            .trim(),
        password: zod_1.z.string({
            required_error: "Password is required!",
        }),
    }),
});
const RefreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refresh_token: zod_1.z.string({
            required_error: "Refresh Token is required",
        }),
    }),
});
const VerifyIsEmailExistingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required!",
        })
            .trim(),
    }),
});
const ForgotPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required!",
        })
            .trim(),
        otp: zod_1.z
            .string({
            required_error: "OTP is required!",
        })
            .trim(),
        password: zod_1.z
            .string({
            required_error: "Password is required!",
        })
            .min(8),
    }),
});
const ChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        mobile_number: zod_1.z
            .string({
            required_error: "Contact number is required!",
        })
            .trim(),
        old_password: zod_1.z.string({
            required_error: "Old password is required!",
        }),
        new_password: zod_1.z
            .string({
            required_error: "New password is required!",
        })
            .min(8),
    }),
});
exports.UserValidation = {
    RegisterUserZodSchema,
    CreateAdminZodSchema,
    UpdateUserZodSchema,
    UpdateUserAndUserDetailsZodSchema,
    LoginUserZodSchema,
    RefreshTokenZodSchema,
    VerifyIsEmailExistingZodSchema,
    ForgotPasswordZodSchema,
    ChangePasswordZodSchema,
};
