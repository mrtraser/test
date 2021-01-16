import axios, { AxiosInstance } from "axios";

export interface AgileEngineApiProps {
  apiKey: string;
}

export interface Page {
  pictures: Picture[];
  page: number;
  pageCount: number;
  hasMore: boolean;
}

export interface Picture {
  id: string;
  cropped_picture: string;
}

export interface FullPicture {
  author: string;
  camera: string;
  id: string;
  full_picture: string;
  cropped_picture: string;
  tags: string;
}

export class AgileEngineApi {
  private client: AxiosInstance;
  private readonly apiKey: string;
  private retry: boolean = false;

  constructor({ apiKey }: AgileEngineApiProps) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    });
    this.setInterceptors();
  }

  async auth(): Promise<void> {
    const response = await this.getToken();

    this.setBearerHeader(response.token);
  }

  getPage(page: number = 0): Promise<Page> {
    const options = page ? { params: { page } } : undefined;

    return this.client.get('/images', options);
  }

  getImage(id: string): Promise<any> {
    return this.client.get(`/images/${id}`);
  }

  private getToken(): Promise<{ auth: boolean, token: string }> {
    return this.client.post('/auth', { apiKey: this.apiKey });
  }

  private setBearerHeader(token: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  private setInterceptors(): void {
    this.client.interceptors.response.use(response => {
      return response.data
    }, async (error) => {
      if (error.status === 401 && !this.retry) {
        this.retry = true;
        const { token } = await this.getToken();
        this.setBearerHeader(token);

        return this.client(error.config);
      }

      this.retry = false;
      return error;
    });
  }
}

export const client = new AgileEngineApi({
  apiKey: process.env.REACT_APP_API_KEY || ''
});