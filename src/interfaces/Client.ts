import { type AddressProps } from "./Address";

export interface ClientProps {
  id?: number;
  userId?: number;
  name?: string;
  phone?: string;
  email?: string;
  observation?: string;
  cnpjCpf?: string;
  addressZipcode?: string;
  addressCity?: string;
  addressDistrict?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressState?: string;
  addressComplement?: string;
  type?: string;
  address?: AddressProps;
}
