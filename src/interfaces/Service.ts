import { type ClientProps } from "./Client";
import { type ClientProjectProps } from "./ClientProjects";

export interface ServiceProps {
  id?: number;
  publicId?: string;
  userId?: number;
  clientId?: number;
  title: string;
  hourValue: number;
  totalValue?: number;
  clientProjectId: number;
  serviceDate?: string;
  ownerId?: number;
  serviceEndDate?: string;
  createdAt?: string;
  status?: string;
  isInvoiced?: boolean;
  ClientProject?: ClientProjectProps;
  ServiceOccurrence?: ServiceOccurrenceProps[];
  _count?: {
    serviceOccurrence: number;
  };
  updateOccorrence?: boolean;
  lastOpenOccurence?: string;
  occurrenceStartDate?: string;
  occurrenceEndDate?: string;
}

export interface ServiceOccurrenceProps {
  id?: number;
  publicId?: string;
  serviceId?: number;
  started?: string;
  ended?: string;
  createdAt?: string;
}
