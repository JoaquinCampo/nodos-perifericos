import { randomInt } from "crypto";
import { db } from "~/server/db";
import {
  type FindUserByEmailAndClinicIdSchema,
  type SendVerificationEmailSchema,
  type SignUpSchema,
} from "~/server/schemas/auth";
import { hash, compare } from "bcryptjs";
import { env } from "~/env";
import { sendEmail } from "~/lib/email";
import { VerificationCodeEmail } from "~/emails/verification-code";
import { sign, verify } from "jsonwebtoken";

export const findUserByEmailAndClinicId = async (
  input: FindUserByEmailAndClinicIdSchema,
) => {
  const { email, clinicId } = input;

  const user = await db.user.findUnique({
    where: { unique_email_per_clinic: { email, clinicId } },
  });

  if (!user) {
    throw new Error("User with this email not found for this clinic");
  }

  return user;
};

export const findUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    omit: { password: true },
    include: {
      clinic: {
        include: {
          configuration: true,
        },
      },
      healthWorker: true,
      clinicAdmin: true,
    },
  });

  if (!user) {
    throw new Error("User with this ID not found");
  }

  return user;
};

export const sendVerificationEmail = async (
  input: SendVerificationEmailSchema,
) => {
  const { email, clinicId } = input;

  const user = await findUserByEmailAndClinicId({ email, clinicId });

  if (user.emailVerified) {
    throw new Error("User with this email already verified");
  }

  const verificationCode = randomInt(100000, 999999).toString();
  const hashedVerificationCode = await hash(verificationCode, 10);

  const token = sign(
    {
      email,
      clinicId,
      hashedVerificationCode,
    },
    env.JWT_SECRET,
  );

  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
    select: { name: true },
  });

  try {
    await sendEmail(
      {
        to: email,
        subject: "Código de verificación - Nodos Periféricos",
      },
      VerificationCodeEmail({ verificationCode, clinicName: clinic?.name }),
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }

  return {
    token,
    message: "Verification email sent successfully",
  };
};

export const signUp = async (input: SignUpSchema) => {
  const { email, password, verificationCode, token } = input;

  let decoded: {
    email: string;
    clinicId: string;
    hashedVerificationCode: string;
  };

  try {
    decoded = verify(token, env.JWT_SECRET) as {
      email: string;
      clinicId: string;
      hashedVerificationCode: string;
    };
  } catch {
    throw new Error("Invalid or expired token");
  }

  if (decoded.email !== email) {
    throw new Error("Email mismatch");
  }

  const isValidCode = await compare(
    verificationCode,
    decoded.hashedVerificationCode,
  );

  if (!isValidCode) {
    throw new Error("Invalid verification code");
  }

  const user = await findUserByEmailAndClinicId({
    email: decoded.email,
    clinicId: decoded.clinicId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("User with this email already verified");
  }

  const hashedPassword = await hash(password, 10);

  return await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      emailVerified: new Date(),
    },
    omit: { password: true },
  });
};
