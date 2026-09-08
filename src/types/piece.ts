export interface HoleData {
  quantity: string;
  diameter: string;
  centerH: string;
  centerV: string;
}

export interface Piece {
  id: string; // e.g. "ID-CL-001"
  description: string;
  height: string; // in mm
  width: string; // in mm
  thickness: string; // e.g. 5/16", 1/4", 12.7 mm
  holesA: HoleData;
  holesB: HoleData;
  observation: string;
  paUsed: string;
  systemCode: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PieceFormData {
  idNumber: string; // just numeric part e.g. "018" or "1"
  description: string;
  height: string;
  width: string;
  thickness: string;
  holesA: HoleData;
  holesB: HoleData;
  observation: string;
  paUsed: string;
  systemCode: string;
}

export interface FilterOptions {
  search?: string;
  idFrom?: string;
  idTo?: string;
  height?: string;
  width?: string;
  thickness?: string;
  holesA_quantity?: string;
  holesA_diameter?: string;
  holesA_centerH?: string;
  holesA_centerV?: string;
  holesB_quantity?: string;
  holesB_diameter?: string;
  holesB_centerH?: string;
  holesB_centerV?: string;
  pa?: string;
  systemCode?: string;
  observation?: string;
}

export type SortField =
  | 'id'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'height'
  | 'width'
  | 'thickness';

export type SortDirection = 'asc' | 'desc';
