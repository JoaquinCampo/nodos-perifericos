import { db } from "~/server/db";
import type {
  CreateClinicSchema,
  FindAllClinicsSchema,
} from "~/server/schemas/clinic";

export const findAllClinics = async (input?: FindAllClinicsSchema) => {
  const { providerName } = input ?? {};

  return await db.clinic.findMany({
    where: {
      ...(providerName && {
        providerName: {
          contains: providerName,
          mode: "insensitive",
        },
      }),
    },
  });
};

export const createClinic = async (input: CreateClinicSchema) => {
  const { name, email, phone, address, providerName, clinicAdmin } = input;

  return await db.clinic.create({
    data: {
      name,
      email,
      phone,
      address,
      providerName,
      users: {
        create: {
          ...clinicAdmin,
          clinicAdmin: {
            create: {},
          },
        },
      },
      configuration: {
        create: {},
      },
    },
  });
};

export const findClinicByName = async (clinicName: string) => {
  return await db.clinic.findFirst({
    where: { name: clinicName },
  });
};
