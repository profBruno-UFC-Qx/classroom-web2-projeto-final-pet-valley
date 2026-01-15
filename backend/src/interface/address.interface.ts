export interface AddressBodyDto {
  ownerId: string;
  cep: number;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  houseNumber: number;
  complement?: string;
}