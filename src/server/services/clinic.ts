import { db } from "~/server/db";
import type { CreateClinicSchema } from "~/server/schemas/clinic";

export const findAllClinics = async () => {
  return await db.clinic.findMany();
};

export const createClinic = async (input: CreateClinicSchema) => {
  const { name, email, phone, address, clinicAdmin } = input;

  const clinic = await db.clinic.create({
    data: {
      name,
      email,
      phone,
      address,
      users: {
        create: {
          name: clinicAdmin.name,
          email: clinicAdmin.email,
          phone: clinicAdmin.phone,
          clinicAdmin: {
            create: {},
          },
        },
      },
    },
  });

  return clinic;
};
