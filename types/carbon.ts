export interface CarbonInput {
  // Identifiers
  name?: string;
  address?: string;

  // Domestic Energy
  gridElectricity: string;
  gasPNG: string;
  cngCylinder: string; // New field

  // Transport
  petrol: string;
  diesel: string;
  cng: string;
  
  // Green Assets
  solarPanels: string;
  solarCapacity: string;
  treeCount: string;
}