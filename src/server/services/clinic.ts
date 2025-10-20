import { db } from "~/server/db";

export const findAll = async () => {
  return await db.clinic.findMany();
};
