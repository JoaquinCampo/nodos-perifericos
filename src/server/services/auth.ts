import { db } from "~/server/db";
import { type FindUserByCiAndClinicIdSchema } from "~/server/schemas/auth";

export const findUserByCiAndClinicId = async (
  input: FindUserByCiAndClinicIdSchema,
) => {
  const { ci, clinicId } = input;

  const user = await db.user.findUnique({
    where: { unique_ci_per_clinic: { ci, clinicId } },
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
