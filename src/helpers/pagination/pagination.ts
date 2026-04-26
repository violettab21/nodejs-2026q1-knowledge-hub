export function getPaginationData<T>(page: number, limit: number, data: T[]) {
  const pages = Math.ceil(data.length / limit);
  const res = data.slice(
    page - 1 + (limit - 1) * (page - 1),
    limit + limit * (page - 1),
  );
  return {
    total: pages,
    totalRecords: data.length,
    page: page,
    limit: limit,
    data: res,
  };
}
