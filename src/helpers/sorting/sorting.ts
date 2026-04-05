export function sortData<T>(field: string, order: 'asc' | 'desc', data: T[]) {
  const res = data.slice();
  res.sort((a, b) => {
    if (typeof a[field] === 'string' && typeof a[field] === 'string') {
      if (order === 'asc') {
        return a[field].localeCompare(b[field]);
      }
      return b[field].localeCompare(a[field]);
    }
    if (typeof a[field] === 'number' && typeof b[field] === 'number') {
      if (order === 'asc') {
        return a[field] - b[field];
      }
      return b[field] - a[field];
    }
    if (Array.isArray(a[field]) && Array.isArray(b[field])) {
      if (order === 'asc') {
        return a[field].toString().localeCompare(b[field].toString());
      }
      return b[field].toString().localeCompare(a[field].toString());
    }
  });
  return res;
}
