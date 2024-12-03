import { type ClientProps } from "./Client";

export interface ClientProjectProps {
  id?: number;
  name: string;
  clientId?: number;
  color: string;
  Client?: ClientProps;
}
