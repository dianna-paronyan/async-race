export function isArrayValue<T>(data: T): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data == null) {
    return [];
  }
  return [data as T];
}
