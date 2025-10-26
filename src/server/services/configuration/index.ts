import type { UpdateConfigurationSchema } from "~/server/schemas/configuration";
import { db } from "~/server/db";
import { checkCanUpdateConfiguration } from "~/server/services/configuration/utils";

export const updateConfiguration = async (input: UpdateConfigurationSchema) => {
  const { configurationId, ...fields } = input;

  await checkCanUpdateConfiguration(configurationId);

  return db.configuration.update({
    where: { id: configurationId },
    data: fields,
  });
};
