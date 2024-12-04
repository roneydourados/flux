import { type AddressProps } from "./Address";

export interface ClientProps {
  id?: number;
  publicId?: string;
  userId?: number;
  hourValueDefault?: number;
  name?: string;
  phone?: string;
  email?: string;
  observation?: string;
  cnpjCpf?: string;
  type?: string;
  address?: AddressProps;
}
