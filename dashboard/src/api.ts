import { tempDataDaily } from "./_tempdatadaily";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

export async function http<T>(path: string): Promise<T> {
  if (path === '/TODO_daily_data_json_view') {
      return tempDataDaily as any;
   }
  path = `${API_BASE_URL}${path}`;
  const request = new Request(path);
  const response = await fetch(request);
  return response.json().catch((e) => {
    console.log(e);
  });
}
