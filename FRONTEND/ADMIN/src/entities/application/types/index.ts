export interface ApplicationEntity {
  id: string;
  plate: string;
  vin: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  carModel: string;
  photos: string;
  status: 'WAITING' | 'ACCEPTED' | 'READY';
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationApi {
 message: string,
 data: ApplicationEntity
}
