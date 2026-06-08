export type BarberSelect = {
  id: string;
  name: string;
};

export type BarberTable = {
  id: string;
  name: string;
  phone: string | null;
  active: boolean;
};

export type BarbersResponse = {
  barbers: BarberTable[];
  total: number;
  totalPages: number;
  currentPage: number;
};