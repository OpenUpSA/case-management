export async function http<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}
