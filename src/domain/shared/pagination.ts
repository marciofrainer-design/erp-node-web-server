export type PaginationParams = {
  page: number;
  pageCount: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageCount: number;
  limit: number;
  total: number;
};

export function parsePaginationParams(query: {
  page?: unknown;
  pageCount?: unknown;
  limit?: unknown;
}): PaginationParams {
  const parsedPage = Number(query.page);
  const parsedPageCount = Number(query.pageCount);
  const parsedLimit = Number(query.limit);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageCount =
    Number.isInteger(parsedPageCount) && parsedPageCount > 0
      ? parsedPageCount
      : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  return {
    page,
    pageCount,
    limit,
  };
}
