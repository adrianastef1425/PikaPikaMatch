import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { ApiError, NetworkError, ValidationError, NotFoundError, ServiceUnavailableError } from './errors';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
          console.log('[API] Request payload:', config.data);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}`, response.data);
        // Extract data from ApiResponse wrapper if it exists
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          return response.data.data;
        }
        return response.data;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }
  
  private handleError(error: AxiosError): Error {
    // Network error (no response)
    if (!error.response) {
      // Check if it's a CORS error
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('[API] CORS or network error detected');
        return new NetworkError('Network error - please check your connection');
      }
      return new NetworkError('Network error - please check your connection');
    }
    
    const status = error.response.status;
    const data = error.response.data as any;
    const message = data?.message || data?.error || error.message;
    
    console.error(`[API] Error ${status}:`, message);
    
    switch (status) {
      case 400:
        return new ValidationError(message || 'Invalid request');
      case 404:
        return new NotFoundError(message || 'Resource not found');
      case 500:
        return new ApiError(message || 'Internal server error', status, false);
      case 503:
        return new ServiceUnavailableError(message || 'Service temporarily unavailable');
      default:
        return new ApiError(message || 'An error occurred', status, false);
    }
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response as T;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response as T;
  }
}

export const apiClient = new ApiClient();
