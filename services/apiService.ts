import { 
  AuthResponse, 
  CalculationInput, 
  CalculationResult, 
  CalculationHistoryResponse, 
  GuestProfileResponse,
  User,
  CommonResponse
} from "../interfaces/api";

const BASE_URL = "http://45.114.212.131:8000";

/**
 * Industry standard API service for Carbon Chain Khoj.
 * Handles authentication, profile management, and calculations.
 */
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(isMultipart = false) {
    const headers: HeadersInit = {};
    
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // --- Auth Endpoints ---

  async register(userData: any): Promise<CommonResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async login(credentials: any): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    const data: AuthResponse = await response.json();
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getProfile(): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Calculator Endpoints ---

  async calculate(input: CalculationInput): Promise<CalculationResult> {
    const response = await fetch(`${BASE_URL}/api/calculate`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(input),
    });
    return response.json();
  }

  async getUserCalculations(): Promise<CalculationHistoryResponse> {
    const response = await fetch(`${BASE_URL}/api/calculations`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Guest Endpoints ---

  async getGuestProfile(guestId: string): Promise<GuestProfileResponse> {
    const response = await fetch(`${BASE_URL}/api/guest/profile/${guestId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getGuestCalculations(guestId: string): Promise<CalculationHistoryResponse> {
    const response = await fetch(`${BASE_URL}/api/guest/calculations/${guestId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();