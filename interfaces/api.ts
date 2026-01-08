/**
 * Industry standard API response and data interfaces 
 * based on the Carbon Chain Khoj API Specification.
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  country?: string;
  city?: string;
  profilePhoto?: string;
  carbonCredits: number;
  projectsJoined: number;
  badges: number;
  carbonSaved: number;
  treesEquivalent: number;
  emissionsReduced: number;
  totalEnergy: number;
  totalTransport: number;
  totalOffset: number;
  totalEmissions: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface CalculationInput {
  lightUnits?: number;
  gasUnits?: number;
  petrolUnits?: number;
  dieselUnits?: number;
  cngUnits?: number;
  treeCount?: number;
  solarPanels?: number;
  guestId?: string;
}

export interface CalculationResult {
  success: boolean;
  data?: {
    co2: number;
    debug: {
      energyEmission: number;
      transportEmission: number;
      treeOffset: number;
      solarOffset: number;
      [key: string]: any;
    };
  };
  message?: string;
}

export interface CalculationHistoryItem {
  id: string;
  inputs: CalculationInput;
  files: string[];
  result: any; // Can be further typed based on CalculationResult['data']
  createdAt: string;
}

export interface CalculationHistoryResponse {
  success: boolean;
  calculations: CalculationHistoryItem[];
}

export interface GuestProfileResponse {
  success: boolean;
  guest: {
    guestId: string;
    name: string;
    totalEnergy: number;
    totalTransport: number;
    totalOffset: number;
    totalEmissions: number;
  };
}

export interface CommonResponse {
  success: boolean;
  message: string;
}