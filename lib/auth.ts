import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "/utils/dbConfig";
import * as schema from "../auth-schema";
import { sendOtpEmail } from "./email";
import { PASSWORD_ERROR_MESSAGE, validatePassword } from "./password";
import { validateFullName } from "./name";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      let password: string | undefined;

      if (ctx.path.startsWith("/sign-up/email")) {
        password = ctx.body?.password;

        const name = typeof ctx.body?.name === "string" ? ctx.body.name : "";
        const nameCheck = validateFullName(name);
        if (!nameCheck.valid) {
          throw new APIError("BAD_REQUEST", {
            message: nameCheck.message ?? "Enter your first and last name",
          });
        }
      } else if (ctx.path.startsWith("/email-otp/reset-password")) {
        password = ctx.body?.password;
      } else if (ctx.path.startsWith("/change-password")) {
        password = ctx.body?.newPassword;
      }

      if (password !== undefined && !validatePassword(password).valid) {
        throw new APIError("BAD_REQUEST", {
          message: PASSWORD_ERROR_MESSAGE,
        });
      }
    }),
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 60, // 1 minute
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: string }) {
        if (type === "email-verification" || type === "forget-password") {
          await sendOtpEmail(email, otp, type);
        }
      },
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8000",
    "http://localhost:5173",
  ].filter(Boolean) as string[],
});
