import { type ClientProps } from "./Client";

export interface ClientProjectProps {
  id?: number;
  name: string;
  clientId?: number;
  publicId?: string;
  color: string;
  Client?: ClientProps;
}
