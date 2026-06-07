export type ServiceSelect = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export type ServiceTable = {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
};

export type ServicesResponse = {
  services: ServiceTable[];
  total: number;
  totalPages: number;
  currentPage: number;
};