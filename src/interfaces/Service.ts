import { type ClientProps } from "./Client";
import { type ClientProjectProps } from "./ClientProjects";

export interface ServiceProps {
  id?: number;
  userId?: number;
  clientId?: number;
  title: string;
  hourValue: number;
  totalValue?: number;
  clientProjectId: number;
  taskDate?: string;
  ownerId?: number;
  taskEndDate?: string;
  createdAt?: string;
  status?: string;
  isInvoiced?: boolean;
  ClientProject?: ClientProjectProps;
  TaskOccurrence?: ServiceOccurrenceProps[];
  _count?: {
    TaskOccurrence: number;
  };
  updateOccorrence?: boolean;
  lastOpenOccurence?: string;
  occurrenceStartDate?: string;
  occurrenceEndDate?: string;
}

export interface ServiceOccurrenceProps {
  id?: number;
  taskId?: number;
  started?: string;
  ended?: string;
  createdAt?: string;
}
