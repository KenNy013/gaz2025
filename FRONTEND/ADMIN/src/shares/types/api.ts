import type { AppStatus } from "../constants/api";

export interface Application {
  id: string;
  plate: string;
  vin: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  carModel: string;
  status: AppStatus;
  message?: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}
