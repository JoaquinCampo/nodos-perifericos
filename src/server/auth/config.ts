import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";

import { db } from "~/server/db";
import {
  findUserByEmailAndClinicId,
  findUserById,
} from "~/server/controllers/auth";
import { compareSync } from "bcryptjs";
import {
  type Clinic,
  type ClinicAdmin,
  type HealthWorker,
} from "@prisma/client";
import { type Configuration } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { encode } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      ci: string;
      name: string;
      email: string;
      phone: string | null;
      image: string | null;
      clinic: (Clinic & { configuration: Configuration }) | null;
      healthWorker: HealthWorker | null;
      clinicAdmin: ClinicAdmin | null;
    } & DefaultSession["user"];
  }
}

class AuthError extends CredentialsSignin {
  code = "Invalid Clinic, CI or Password";
}

const adapter = PrismaAdapter(db);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        clinicId: { label: "Clinic ID", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data: parsedCredentials, success } = z
          .object({
            clinicId: z.string(),
            email: z.string().email("El email no es válido"),
            password: z.string(),
          })
          .safeParse(credentials);

        if (!success) throw new AuthError();

        const { clinicId, email, password } = parsedCredentials;

        const user = await findUserByEmailAndClinicId({ email, clinicId });

        if (!user?.password || !compareSync(password, user.password))
          throw new AuthError();

        const { password: _password, ...userWithoutPassword } = user;

        return userWithoutPassword;
      },
    }),
  ],
  adapter,
  callbacks: {
    session: async ({ session }) => {
      const sessionUser = await findUserById({ id: session.user.id });

      return {
        ...session,
        user: sessionUser,
      };
    },
    jwt: async ({ token, account }) => {
      if (
        account &&
        (account.provider === "credentials" || account.provider === "phone")
      ) {
        token.credentials = true;
      }

      return token;
    },
  },
  jwt: {
    encode: async (params) => {
      if (params.token?.credentials) {
        const sessionToken = uuidv4();

        if (!params.token.sub) {
          throw new Error("User id not found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }

      return encode(params);
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  events: {
    async signOut(message) {
      if ("session" in message && message.session) {
        await adapter?.deleteSession?.(message.session.sessionToken);
      }
    },
  },
} satisfies NextAuthConfig;
