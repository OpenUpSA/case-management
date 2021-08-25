import { tempDataMonthly } from "./_tempdatamonthly";
import { tempDataDaily } from "./_tempdatadaily";

export async function http<T>(request: RequestInfo): Promise<T> {
  if (request === '/api/v1/TODO_monthly_data_json_view') {
    return tempDataMonthly as any;
  }
  if (request === '/api/v1/TODO_daily_data_json_view') {
    return tempDataDaily as any;
  }
  const response = await fetch(request);
  const body = await response.json();
  return body;
}
