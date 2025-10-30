import {
  createLoader,
  parseAsInteger,
  parseAsString,
  type inferParserType,
} from "nuqs/server";

export const paginationParams = {
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(20),
};

export const filterParams = {
  name: parseAsString.withDefault(""),
  ci: parseAsString.withDefault(""),
  clinic: parseAsString.withDefault(""),
};

export const searchParams = {
  ...paginationParams,
  ...filterParams,
};

export type SearchParams = inferParserType<typeof searchParams>;

export const loadSearchParams = createLoader(searchParams);
