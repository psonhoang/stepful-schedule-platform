export default class MyHttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || "";
  }

  async get(url: string, params?: any) {
    const searchParams = params ? `?${new URLSearchParams(params)}` : "";
    const response = await fetch(`${this.baseUrl}/${url}${searchParams}`, {
      cache: "no-store",
    });
    return response.json();
  }

  async put(url: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${url}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return response.json();
  }

  async patch(url: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${url}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return response.json();
  }

  async post(url: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${url}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return response.json();
  }

  async delete(url: string) {
    const response = await fetch(`${this.baseUrl}/${url}`, {
      method: "DELETE",
      cache: "no-store",
    });
    return response.json();
  }
}

export const client = new MyHttpClient();
