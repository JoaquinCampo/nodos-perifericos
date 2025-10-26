import { db } from "~/server/db";
import type { CreateClinicSchema } from "~/server/schemas/clinic";

export const findAllClinics = async () => {
  return await db.clinic.findMany();
};

export const createClinic = async (input: CreateClinicSchema) => {
  const { name, email, phone, address, clinicAdmin } = input;

  return await db.clinic.create({
    data: {
      name,
      email,
      phone,
      address,
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
