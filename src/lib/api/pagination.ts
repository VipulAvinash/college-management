export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function parsePagination(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : DEFAULT_PAGE;
  const limitRequested =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : DEFAULT_LIMIT;
  const limit = Math.min(limitRequested, MAX_LIMIT);

  return { page, limit, offset: (page - 1) * limit };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
