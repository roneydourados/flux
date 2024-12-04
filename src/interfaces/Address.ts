export interface AddressProps {
  id?: number;
  publicId?: string;
  userId?: number;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  category?: string;
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CepAdderssProps {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

export const ADDRESS_USER = "USER";
export const ADDRESS_CLIENT = "CLIENT";
