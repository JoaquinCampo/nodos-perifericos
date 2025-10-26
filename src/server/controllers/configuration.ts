import type { UpdateConfigurationSchema } from "~/server/schemas/configuration";
import * as configurationService from "~/server/services/configuration";

export const updateConfiguration = async (input: UpdateConfigurationSchema) => {
  return await configurationService.updateConfiguration(input);
};
