export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  clipIds: string[];
  createdAt: string;
  updatedAt: string;
}
